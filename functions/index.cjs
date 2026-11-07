const { createHash, randomUUID } = require('node:crypto');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { HttpsError, onCall } = require('firebase-functions/v2/https');
const { drawHanjaMission_, hanjaCatalog_, validateTeacherCard_ } = require('./hanja.cjs');
const { characterState_, applyCharacterChange_ } = require('./game.cjs');

initializeApp();
const db = getFirestore();
const rooms = db.collection('classrooms');
const students = db.collection('students');
const results = db.collection('results');
const custom = db.collection('curriculum');
const verifiedGoogle = auth => auth?.token?.firebase?.sign_in_provider === 'google.com' && auth.token.email_verified === true;
const denied = message => new HttpsError('permission-denied', message);
const invalid = message => new HttpsError('invalid-argument', message);
const hash = value => createHash('sha256').update(value).digest('hex');
const uuid = value => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(value);
const gradeOf = value => {
  const grade = String(value);
  if (!/^[1-6]$/.test(grade)) throw invalid('학년을 확인해 주세요.');
  return grade;
};
const labelOf = (value, max, message) => {
  const label = typeof value === 'string' ? value.trim().normalize('NFC') : '';
  if (!label || label.length > max || /[\u0000-\u001f\u007f]/.test(label)) throw invalid(message);
  return label;
};
const roomRef = id => {
  if (typeof id !== 'string' || !/^[a-f0-9]{32}$/.test(id)) throw invalid('반을 선택해 주세요.');
  return rooms.doc(id);
};
const roomView = (id, room) => ({ id, grade: room.grade, label: room.label, generation: room.generation, resetting: room.resetting });
const profileView = student => ({
  classId: student.roomId, generation: student.generation, name: student.nickname,
  grade: student.grade, classroom: student.classroom, number: student.number, status: student.status
});
const isTeacher = auth => auth.teacher === true;
const requireTeacher = auth => {
  if (!isTeacher(auth)) throw denied('승인된 교사 로그인이 필요합니다.');
};
const requireOwnedRoom = (auth, room) => {
  requireTeacher(auth);
  if (!room || room.owner !== auth.uid) throw denied('내가 등록한 반만 관리할 수 있어요.');
};
const requireStudent = (student, room) => {
  if (!student || !room || student.status !== 'approved' || room.resetting || student.generation !== room.generation) {
    throw denied('반 승인을 받은 뒤 다시 입장해 주세요.');
  }
};

async function readStudent(reader, uid) {
  const get = ref => reader ? reader.get(ref) : ref.get();
  const ref = students.doc(uid);
  const student = (await get(ref)).data();
  const room = student ? (await get(rooms.doc(student.roomId))).data() : null;
  return { ref, student, room };
}

async function enter(auth, data) {
  const selected = roomRef(data.classId);
  const nickname = labelOf(data.name, 30, '닉네임을 30자 이내로 입력해 주세요.');
  if (typeof data.number !== 'string' || !/^[0-9]{1,3}$/.test(data.number) || !Number(data.number)) {
    throw invalid('번호를 1~999 사이 숫자로 입력해 주세요.');
  }
  return db.runTransaction(async tx => {
    const ref = students.doc(auth.uid);
    const old = (await tx.get(ref)).data();
    if (old) {
      if (old.roomId !== selected.id) throw denied('이미 다른 반에 신청했어요. 담당 선생님께 문의해 주세요.');
      return profileView(old);
    }
    const room = (await tx.get(selected)).data();
    if (!room || room.resetting) throw denied('지금은 이 반에 들어갈 수 없어요.');
    const members = await tx.get(classQuery(students, selected.id, room.generation).limit(200));
    if (members.size >= 200) throw new HttpsError('resource-exhausted', '이 반에 더 이상 신청할 수 없어요.');
    const record = {
      roomId: selected.id, grade: room.grade, classroom: room.label, generation: room.generation,
      nickname, number: data.number, status: 'pending', createdAt: FieldValue.serverTimestamp(),
      state: characterState_(null), devices: {},
    };
    tx.create(ref, record);
    return profileView(record);
  });
}

async function listRooms(auth) {
  const query = isTeacher(auth) ? rooms.where('owner', '==', auth.uid) : rooms.where('resetting', '==', false);
  const snapshot = await query.limit(200).get();
  return snapshot.docs.map(doc => roomView(doc.id, doc.data()));
}

async function registerRoom(auth, data) {
  requireTeacher(auth);
  const grade = gradeOf(data.grade);
  const label = labelOf(data.label, 60, '반 이름을 60자 이내로 입력해 주세요.');
  const id = hash(JSON.stringify([auth.uid, grade, label])).slice(0, 32);
  const ref = rooms.doc(id);
  const room = { owner: auth.uid, grade, label, generation: 0, resetting: false };
  try { await ref.create(room); } catch (error) {
    if (error.code === 6) throw new HttpsError('already-exists', '이미 등록된 반이에요.');
    throw error;
  }
  return roomView(id, room);
}

async function changeMembership(auth, data) {
  if (typeof data.studentId !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(data.studentId) ||
      !['approved', 'rejected'].includes(data.status)) throw invalid('신청 정보를 확인해 주세요.');
  const ref = students.doc(data.studentId);
  return db.runTransaction(async tx => {
    const student = (await tx.get(ref)).data();
    if (!student) throw new HttpsError('not-found', '신청 기록이 없어요.');
    const room = (await tx.get(rooms.doc(student.roomId))).data();
    requireOwnedRoom(auth, room);
    if (room.resetting || student.generation !== room.generation || student.status !== 'pending') {
      throw denied('이 신청은 이미 처리되었거나 반을 초기화하고 있어요.');
    }
    if (data.status === 'rejected') tx.delete(ref);
    else tx.update(ref, { status: 'approved' });
    return { ok: true };
  });
}

async function additions(owner) {
  return (await custom.doc(owner).get()).data()?.cards || [];
}

async function teacherAdd(auth, data) {
  requireTeacher(auth);
  let card;
  try { card = validateTeacherCard_(data); } catch (error) { throw invalid(error.message); }
  card.id = 'extra-' + card.grade + '-' + card.character.codePointAt(0).toString(16);
  const ref = custom.doc(auth.uid);
  return db.runTransaction(async tx => {
    const cards = (await tx.get(ref)).data()?.cards || [];
    if (cards.filter(entry => entry.grade === card.grade).length >= 30) throw invalid('학년별로 30자까지 추가할 수 있어요.');
    if (hanjaCatalog_('v2', cards).grades[card.grade].cards.some(entry => entry.character === card.character)) throw invalid('이미 등록된 한자예요.');
    tx.set(ref, { cards: [...cards, card] });
    return card;
  });
}

async function newMission(auth, data) {
  const grade = gradeOf(data.grade);
  return db.runTransaction(async tx => {
    const { ref, student, room } = await readStudent(tx, auth.uid);
    requireStudent(student, room);
    const cards = (await tx.get(custom.doc(room.owner))).data()?.cards || [];
    if (student.mission && Date.now() - student.mission.created < 1500) throw new HttpsError('resource-exhausted', '잠깐 기다렸다가 다시 뽑아 주세요.');
    const draw = drawHanjaMission_(grade, cards);
    const mission = { id: randomUUID(), created: Date.now(), grade, version: draw.version, cards: draw.cards, reviewed: [], rewarded: false };
    tx.update(ref, { mission });
    return { version: draw.version, cards: draw.cards, missionId: mission.id };
  });
}

function gradeQuiz(mission, answers) {
  if (!Array.isArray(answers) || answers.length !== mission.cards.length) throw invalid('퀴즈 답안을 확인해 주세요.');
  const remaining = new Map(mission.cards.map(card => [card.id, card]));
  let correctCount = 0;
  for (const answer of answers) {
    const card = remaining.get(answer?.questionId);
    if (!card || !card.options.some(option => option.id === answer.optionId)) throw invalid('퀴즈 문항과 답안을 확인해 주세요.');
    remaining.delete(answer.questionId);
    if (answer.optionId === card.correctOptionId) correctCount += 1;
  }
  return correctCount;
}

async function characterSync(auth, data) {
  const changes = data.changes ?? [];
  if (!uuid(data.device) || !Array.isArray(changes) || changes.length > 60 ||
      changes.some(change => !change || !Number.isSafeInteger(change.seq) || change.seq < 1)) {
    throw invalid('캐릭터 저장 요청을 확인해 주세요.');
  }
  return db.runTransaction(async tx => {
    const { ref, student, room } = await readStudent(tx, auth.uid);
    if (!student || data.generation !== student.generation || !room || room.resetting || student.generation !== room.generation) return { reset: true };
    requireStudent(student, room);
    const state = characterState_(student.state);
    const mission = student.mission;
    const devices = student.devices || {};
    let accepted = devices[data.device] || 0;
    let rejected = 0;
    let changed = false;
    for (const change of changes) {
      if (change.seq <= accepted) continue;
      if (change.seq !== accepted + 1) throw invalid('이 기기의 저장 순서를 확인할 수 없어요.');
      let applied = false;
      if (change.type === 'equip') {
        applied = applyCharacterChange_(state, change);
      } else if (mission && change.missionId === mission.id && change.type === 'learn' && mission.cards.some(card => card.id === change.id)) {
        if (!mission.reviewed.includes(change.id)) mission.reviewed.push(change.id);
        applied = applyCharacterChange_(state, change);
      } else if (mission && change.missionId === mission.id && change.type === 'badge' && mission.reviewed.length === mission.cards.length) {
        let verified = change.badge === '놀이 완주 배지';
        if (change.badge === '한자 탐험 완주 배지' || change.badge === '한자 달인 배지') {
          try {
            const score = gradeQuiz(mission, change.answers);
            verified = change.badge === '한자 탐험 완주 배지' || score === mission.cards.length;
          } catch (error) {
            if (!(error instanceof HttpsError)) throw error;
          }
        }
        if (verified) {
          applied = applyCharacterChange_(state, { ...change, earned: !mission.rewarded });
          if (applied) mission.rewarded = true;
        }
      }
      if (!applied) rejected += 1;
      accepted = change.seq;
      changed = true;
    }
    if (changed) {
      devices[data.device] = accepted;
      if (Object.keys(devices).length > 300) throw new HttpsError('resource-exhausted', '기기 저장 한도에 도달했어요.');
      const update = { state, devices };
      if (mission) update.mission = mission;
      tx.update(ref, update);
    }
    return { state, accepted, rejected };
  });
}

async function submit(auth, data) {
  if (!uuid(data.submissionId) || !uuid(data.missionId) || !Array.isArray(data.answers) || data.answers.length !== 20) throw invalid('퀴즈 제출 정보를 확인해 주세요.');
  const digest = hash(JSON.stringify([data.missionId, data.answers.map(answer => [answer?.questionId, answer?.optionId])]));
  const resultRef = results.doc(hash(auth.uid + ':' + data.missionId));
  return db.runTransaction(async tx => {
    const { student, room } = await readStudent(tx, auth.uid);
    requireStudent(student, room);
    const prior = (await tx.get(resultRef)).data();
    if (prior) {
      if (prior.digest !== digest || prior.submissionId !== data.submissionId) throw invalid('이 퀴즈 결과는 이미 제출했어요.');
      return { submissionId: data.submissionId };
    }
    if (student.mission?.id !== data.missionId) throw invalid('현재 한자 놀이의 퀴즈만 제출할 수 있어요.');
    const mission = student.mission;
    const correctCount = gradeQuiz(mission, data.answers);
    tx.create(resultRef, {
      studentId: auth.uid, roomId: student.roomId, generation: student.generation, grade: mission.grade,
      correctCount, questionCount: mission.cards.length, digest, submissionId: data.submissionId, createdAt: FieldValue.serverTimestamp()
    });
    return { submissionId: data.submissionId };
  });
}

const classQuery = (collection, id, generation) => collection.where('roomId', '==', id).where('generation', '==', generation);

async function gallery(auth) {
  return db.runTransaction(async tx => {
    const { student, room } = await readStudent(tx, auth.uid);
    requireStudent(student, room);
    const members = await tx.get(classQuery(students, student.roomId, student.generation).limit(250));
    return members.docs.map(doc => doc.data()).filter(item => item.status === 'approved').map(item => {
      const { theme, hat, scarf, hair, skin, top, bottom, glasses, shoes, badges } = characterState_(item.state);
      return { nickname: item.nickname, outfit: { theme, hat, scarf, hair, skin, top, bottom, glasses, shoes }, badges };
    }).sort((a, b) => a.nickname.localeCompare(b.nickname, 'ko'));
  });
}

async function summary(auth, data) {
  const ref = roomRef(data.scope);
  const room = (await ref.get()).data();
  requireOwnedRoom(auth, room);
  const [members, submitted] = await Promise.all([
    classQuery(students, ref.id, room.generation).limit(250).get(),
    classQuery(results, ref.id, room.generation).count().get()
  ]);
  return {
    label: room.grade + '학년 · ' + room.label, generation: room.generation, resetting: room.resetting,
    count: members.size, resultCount: submitted.data().count,
    students: members.docs.map(doc => {
      const member = doc.data();
      return { id: doc.id, nickname: member.nickname, number: member.number, status: member.status, points: member.state.coins, badges: member.state.badges.length };
    })
  };
}

async function eraseGeneration(collection, id, generation) {
  let removed = 0;
  for (let batchNumber = 0; batchNumber < 25; batchNumber += 1) {
    const page = await classQuery(collection, id, generation).limit(200).get();
    if (page.empty) return removed;
    const batch = db.batch();
    for (const doc of page.docs) batch.delete(doc.ref, { lastUpdateTime: doc.updateTime });
    await batch.commit();
    removed += page.size;
  }
  throw new HttpsError('aborted', '삭제가 진행 중이에요. 같은 반을 다시 확인하고 이어서 실행해 주세요.');
}

async function reset(auth, data) {
  const ref = roomRef(data.scope);
  const generation = await db.runTransaction(async tx => {
    const room = (await tx.get(ref)).data();
    requireOwnedRoom(auth, room);
    if (data.confirmation !== room.grade + '학년 · ' + room.label || data.generation !== room.generation) {
      throw invalid('반 이름과 삭제할 학년도 기록을 다시 확인해 주세요.');
    }
    if (!room.resetting) tx.update(ref, { resetting: true });
    return room.generation;
  });
  const [removed, removedResults] = await Promise.all([
    eraseGeneration(students, ref.id, generation),
    eraseGeneration(results, ref.id, generation)
  ]);
  await db.runTransaction(async tx => {
    const room = (await tx.get(ref)).data();
    requireOwnedRoom(auth, room);
    if (room.resetting && room.generation === generation) tx.update(ref, { generation: generation + 1, resetting: false });
  });
  return { removed, removedResults };
}

const actions = {
  'auth.profile': async auth => {
    const { student, room } = await readStudent(null, auth.uid);
    return { teacher: isTeacher(auth), student: student && room && student.generation === room.generation && !room.resetting ? profileView(student) : null };
  },
  'classroom.list': listRooms,
  'classroom.register': registerRoom,
  'classroom.membership': changeMembership,
  'classroom.avatars': gallery,
  'classroom.characters': summary,
  'classroom.reset': reset,
  'student.enter': enter,
  'student.submit': submit,
  'character.sync': characterSync,
  'hanja.mission': newMission,
  'teacher.cards': async auth => {
    requireTeacher(auth);
    return hanjaCatalog_('v2', await additions(auth.uid)).grades;
  },
  'teacher.addCard': teacherAdd
};

const origins = process.env.FUNCTIONS_EMULATOR === 'true'
  ? [/^http:\/\/(localhost|127\.0\.0\.1):\d+$/]
  : [process.env.PAGES_ORIGIN].filter(Boolean);

exports.hanjaApi = onCall({ region: 'asia-northeast3', cors: origins, maxInstances: 5, timeoutSeconds: 180 }, async request => {
  if (!verifiedGoogle(request.auth)) throw new HttpsError('unauthenticated', 'Google 계정으로 로그인해 주세요.');
  const { action, payload = {} } = request.data || {};
  if (typeof action !== 'string' || !Object.prototype.hasOwnProperty.call(actions, action) ||
      !payload || typeof payload !== 'object' || Array.isArray(payload)) throw invalid('지원하지 않는 요청입니다.');
  if (action === 'student.submit' && process.env.SUBMISSIONS_ENABLED !== 'true') {
    throw new HttpsError('failed-precondition', '현재는 결과를 받지 않아요.');
  }
  const staff = (await db.collection('staff').doc(request.auth.uid).get()).data();
  return actions[action]({ uid: request.auth.uid, teacher: staff?.role === 'teacher' }, payload);
});
