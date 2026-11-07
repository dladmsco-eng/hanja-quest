const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');

function setup() {
  const store = new Map();
  let revision = 0;
  const pathOf = (name, id) => name + '/' + id;
  const copy = value => value === undefined ? undefined : structuredClone(value);
  function write(ref, value) {
    store.set(ref.path, { value: copy(value), version: ++revision });
  }
  function collection(name) {
    function query(filters = [], cap = Infinity) {
      return {
        where: (field, operator, value) => {
          assert.equal(operator, '==');
          return query([...filters, [field, value]], cap);
        },
        limit: size => query(filters, size),
        async get() {
          const docs = [...store.entries()]
            .filter(([key, entry]) => key.startsWith(name + '/') && filters.every(([field, value]) => entry.value[field] === value))
            .slice(0, cap)
            .map(([key, entry]) => {
              const id = key.split('/')[1];
              return { id, ref: doc(id), data: () => copy(entry.value), updateTime: entry.version };
            });
          return { docs, size: docs.length, empty: !docs.length };
        },
        count() {
          return { get: async () => {
            const result = await this.get();
            return { data: () => ({ count: result.size }) };
          } };
        }
      };
    }
    function doc(id) {
      const ref = { id, path: pathOf(name, id) };
      ref.get = async () => ({ data: () => copy(store.get(ref.path)?.value) });
      ref.create = async value => {
        if (store.has(ref.path)) throw Object.assign(new Error('exists'), { code: 6 });
        write(ref, value);
      };
      return ref;
    }
    return { ...query(), doc };
  }
  const db = {
    collection,
    async runTransaction(fn) {
      const changes = [];
      const result = await fn({
        get: ref => ref.get(),
        create: (ref, value) => changes.push(() => ref.create(value)),
        update: (ref, value) => changes.push(() => write(ref, { ...store.get(ref.path).value, ...value })),
        set: (ref, value) => changes.push(() => write(ref, value)),
        delete: ref => changes.push(() => store.delete(ref.path))
      });
      for (const change of changes) await change();
      return result;
    },
    batch() {
      const deletes = [];
      return {
        delete(ref, guard) { deletes.push([ref, guard]); },
        async commit() {
          for (const [ref, guard] of deletes) assert.equal(store.get(ref.path)?.version, guard.lastUpdateTime);
          for (const [ref] of deletes) store.delete(ref.path);
        }
      };
    }
  };
  class HttpsError extends Error {
    constructor(code, message) { super(message); this.code = code; }
  }
  const output = {};
  const context = vm.createContext({
    exports: output, process: { env: { SUBMISSIONS_ENABLED: 'true', PAGES_ORIGIN: 'https://example.github.io' } },
    require(name) {
      if (name === 'firebase-admin/app') return { initializeApp() {} };
      if (name === 'firebase-admin/firestore') return { getFirestore: () => db, FieldValue: { serverTimestamp: () => 123 } };
      if (name === 'firebase-functions/v2/https') return { HttpsError, onCall: (_options, handler) => handler };
      return require(name.startsWith('./') ? '../functions/' + name.slice(2) : name);
    }
  });
  vm.runInContext(readFileSync('functions/index.cjs', 'utf8'), context);
  const google = uid => ({ uid, token: { firebase: { sign_in_provider: 'google.com' }, email_verified: true } });
  const call = (uid, action, payload = {}, auth = google(uid)) => output.hanjaApi({ auth, data: { action, payload } });
  const teacher = uid => write(collection('staff').doc(uid), { role: 'teacher' });
  return { call, teacher, store };
}

test('Google identity and server-owned class approval isolate student and teacher records', async () => {
  const { call, teacher } = setup();
  teacher('teacher-one');
  teacher('teacher-two');
  const classroom = await call('teacher-one', 'classroom.register', { grade: 2, label: '햇살반' });
  await assert.rejects(call('student-one', 'classroom.list', {}, null), { code: 'unauthenticated' });
  await assert.rejects(call('student-one', 'classroom.register', { grade: 2, label: '시험' }), { code: 'permission-denied' });
  const request = await call('student-one', 'student.enter', { classId: classroom.id, number: '007', name: '별콩', status: 'approved' });
  assert.equal(request.status, 'pending');
  await assert.rejects(call('student-one', 'classroom.avatars'), { code: 'permission-denied' });
  await assert.rejects(call('teacher-two', 'classroom.membership', { studentId: 'student-one', status: 'approved' }), { code: 'permission-denied' });
  await assert.rejects(call('teacher-two', 'classroom.characters', { scope: classroom.id }), { code: 'permission-denied' });
  await call('teacher-one', 'classroom.membership', { studentId: 'student-one', status: 'approved' });
  const avatars = await call('student-one', 'classroom.avatars');
  assert.equal(avatars[0].nickname, '별콩');
  assert.deepEqual(Object.keys(avatars[0]).sort(), ['badges', 'nickname', 'outfit']);
  await assert.rejects(call('student-two', 'classroom.avatars'), { code: 'permission-denied' });
});

test('class reset erases student profiles and results and rejects writes from the old school year', async () => {
  const { call, teacher, store } = setup();
  teacher('teacher-one');
  const classroom = await call('teacher-one', 'classroom.register', { grade: 2, label: '햇살반' });
  const other = await call('teacher-one', 'classroom.register', { grade: 2, label: '달빛반' });
  for (const [uid, room] of [['student-one', classroom], ['student-two', other]]) {
    await call(uid, 'student.enter', { classId: room.id, number: '1', name: '별콩' });
    await call('teacher-one', 'classroom.membership', { studentId: uid, status: 'approved' });
    const mission = await call(uid, 'hanja.mission', { grade: 2 });
    const answers = mission.cards.map(card => ({ questionId: card.id, optionId: card.correctOptionId }));
    const submission = { missionId: mission.missionId, submissionId: randomUUID(), answers };
    assert.equal((await call(uid, 'student.submit', submission)).submissionId, submission.submissionId);
    assert.equal((await call(uid, 'student.submit', submission)).submissionId, submission.submissionId);
    await assert.rejects(call(uid, 'student.submit', { ...submission, submissionId: randomUUID() }), { code: 'invalid-argument' });
    const device = randomUUID();
    const changes = [{ seq: 1, type: 'learn', id: mission.cards[0].id, missionId: mission.missionId }];
    assert.equal((await call(uid, 'character.sync', { generation: 0, device, changes, initial: { coins: 99 } })).state.coins, 1);
    assert.equal((await call(uid, 'character.sync', { generation: 0, device, changes })).state.coins, 1);
  }
  const payload = { scope: classroom.id, generation: 0, confirmation: '2학년 · 햇살반' };
  await assert.rejects(call('student-one', 'classroom.reset', payload), { code: 'permission-denied' });
  assert.equal((await call('teacher-one', 'classroom.characters', payload)).resultCount, 1);
  const removed = await call('teacher-one', 'classroom.reset', payload);
  assert.equal(removed.removed, 1);
  assert.equal(removed.removedResults, 1);
  assert.equal((await call('student-one', 'auth.profile')).student, null);
  assert.equal((await call('student-one', 'character.sync', { generation: 0, device: randomUUID() })).reset, true);
  assert.equal((await call('student-two', 'auth.profile')).student.classId, other.id);
  assert.equal([...store].filter(([key]) => key.startsWith('results/')).length, 1);
  await assert.rejects(call('teacher-one', 'classroom.reset', payload), { code: 'invalid-argument' });
  const request = await call('student-one', 'student.enter', { classId: classroom.id, number: '1', name: '별콩' });
  assert.equal(request.generation, 1);
  assert.equal(request.status, 'pending');
});
