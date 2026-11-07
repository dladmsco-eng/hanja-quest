const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const fs = require('firebase/firestore');
const { initializeTestEnvironment, assertFails } = require('@firebase/rules-unit-testing');
const game = require('../functions/game.cjs');
const hanja = require('../functions/hanja.cjs');

test('Spark login, approval, private gallery, sync, and class reset', async t => {
  const env = await initializeTestEnvironment({
    projectId: 'demo-hanja-quest',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') }
  });
  t.after(() => env.cleanup());
  await env.clearFirestore();
  const { createSparkBackend } = await import('../web/spark.mjs');
  const teacherUid = 'teacher';
  const studentUid = 'student';
  const otherUid = 'other';
  const firebase = { sign_in_provider: 'google.com' };
  const context = (uid, claims = { email_verified: true, firebase }) => env.authenticatedContext(uid, claims).firestore();
  const api = (db, uid) => createSparkBackend({ db, fs, uid, game, hanja });
  const teacherDb = context(teacherUid);
  const studentDb = context(studentUid);
  const otherDb = context(otherUid);
  const teacher = api(teacherDb, teacherUid);
  const student = api(studentDb, studentUid);
  const other = api(otherDb, otherUid);
  await env.withSecurityRulesDisabled(async context => {
    await fs.setDoc(fs.doc(context.firestore(), 'settings', 'activity'), { submissionsEnabled: true });
  });
  assert.equal((await teacher('auth.profile')).teacher, true);
  assert.deepEqual(await student('auth.profile'), { teacher: true, student: null });
  const room = await teacher('classroom.register', { grade: '2', label: '햇살반' });
  const otherRoom = await other('classroom.register', { grade: '2', label: '햇살반' });
  assert.notEqual(otherRoom.id, room.id);
  assert.deepEqual((await teacher('classroom.list')).map(room => room.id), [room.id]);
  assert.deepEqual((await other('classroom.list')).map(room => room.id), [otherRoom.id]);
  assert.deepEqual(await student('classroom.list'), []);
  assert.equal((await student('classroom.find', { classId: room.id })).id, room.id);
  await assertFails(fs.getDocs(fs.query(fs.collection(studentDb, 'classrooms'), fs.limit(200))));
  await assertFails(fs.getDocs(fs.query(fs.collection(env.unauthenticatedContext().firestore(), 'classrooms'), fs.limit(200))));
  await assertFails(fs.getDocs(fs.query(fs.collection(context('wrong', { email_verified: true, firebase: { sign_in_provider: 'password' } }), 'classrooms'), fs.limit(200))));
  assert.equal((await student('student.enter', { classId: room.id, name: '별님', number: '07' })).status, 'pending');
  await assertFails(fs.updateDoc(fs.doc(otherDb, 'classrooms', room.id), { resetting: true }));
  await assertFails(fs.updateDoc(fs.doc(otherDb, 'students', studentUid), { status: 'approved' }));
  await assertFails(fs.updateDoc(fs.doc(studentDb, 'students', studentUid), { status: 'approved' }));
  await assertFails(fs.getDocs(fs.query(fs.collection(otherDb, 'students'), fs.where('roomId', '==', room.id), fs.limit(200))));
  await assert.rejects(student('classroom.avatars'), /반 승인/);
  const pending = await teacher('classroom.characters', { scope: room.id });
  assert.equal(pending.students[0].number, '07');
  await teacher('classroom.membership', { scope: room.id, studentId: studentUid, status: 'approved' });
  await teacher('teacher.addCard', { grade: '2', character: '鑫', meaning: '성할', reading: '흠', example: '' });
  assert.equal((await teacher('teacher.cards'))[2].cards.some(card => card.character === '鑫'), true);
  await assertFails(fs.getDoc(fs.doc(otherDb, 'students', studentUid)));
  const mission = await student('hanja.mission', { grade: '2' });
  assert.equal(mission.cards.length, 20);
  const changes = [{ seq: 1, type: 'learn', id: mission.cards[0].id, missionId: mission.missionId }];
  const device = crypto.randomUUID();
  assert.equal((await student('character.sync', { generation: 0, device, changes })).state.coins, 1);
  assert.equal((await student('character.sync', { generation: 0, device, changes })).state.coins, 1);
  assert.equal((await api(context(studentUid), studentUid)('character.sync', { generation: 0, device: crypto.randomUUID(), changes: [] })).state.coins, 1);
  const gallery = await student('classroom.avatars');
  assert.deepEqual(Object.keys(gallery[0]).sort(), ['badges', 'nickname', 'outfit']);
  const avatarId = (await fs.getDoc(fs.doc(studentDb, 'students', studentUid))).data().avatarId;
  await assertFails(fs.updateDoc(fs.doc(studentDb, 'classrooms', room.id, 'years', '0', 'avatars', avatarId), { nickname: '바꾼 이름', number: '07' }));
  await assertFails(fs.getDocs(fs.query(fs.collection(otherDb, 'classrooms', room.id, 'years', '0', 'avatars'), fs.limit(200))));
  const payload = { missionId: mission.missionId, submissionId: crypto.randomUUID(), answers: mission.cards.map(card => ({ questionId: card.id, optionId: card.correctOptionId })) };
  assert.deepEqual(await student('student.submit', payload), await student('student.submit', payload));
  assert.equal((await teacher('classroom.characters', { scope: room.id })).resultCount, 1);
  await other('student.enter', { classId: otherRoom.id, name: '달님', number: '03' });
  const reset = await teacher('classroom.reset', { scope: room.id, confirmation: '2학년 · 햇살반', generation: 0 });
  assert.deepEqual(reset, { removed: 1, removedResults: 1 });
  assert.equal((await student('auth.profile')).student, null);
  assert.equal((await other('auth.profile')).student.name, '달님');
  assert.equal((await student('character.sync', { generation: 0, device, changes })).reset, true);
  assert.equal((await student('student.enter', { classId: room.id, name: '별님', number: '07' })).generation, 1);
  await env.withSecurityRulesDisabled(async context => {
    for (const segment of ['avatars', 'avatarOwners', 'results']) {
      const docs = await fs.getDocs(fs.collection(context.firestore(), 'classrooms', room.id, 'years', '0', segment));
      assert.equal(docs.size, 0);
    }
  });
});
