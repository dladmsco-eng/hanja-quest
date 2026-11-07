const uuid = value => typeof value === 'string' && /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(value);
const fail = message => { throw new Error(message); };
const roomLabel = room => room.grade + '학년 · ' + room.label;

async function digest(value) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(value)));
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
}

function cleanLabel(value, max, message) {
  const text = typeof value === 'string' ? value.trim().normalize('NFC') : '';
  if (!text || text.length > max || /[\u0000-\u001f\u007f]/.test(text)) fail(message);
  return text;
}

export function createSparkBackend({ db, fs, uid, game, hanja }) {
  const { characterState_, applyCharacterChange_, CHARACTER_DEFAULTS_ } = game;
  const { hanjaCatalog_, drawHanjaMission_, validateTeacherCard_ } = hanja;
  const { doc, collection, query, where, limit, getDocFromServer, getDocsFromServer,
    getCountFromServer, runTransaction, setDoc, serverTimestamp } = fs;
  const rooms = collection(db, 'classrooms');
  const students = collection(db, 'students');
  const profileRef = doc(students, uid);
  const missionCache = new Map();
  const roomRef = id => {
    if (typeof id !== 'string' || !/^[a-f0-9]{32}$/.test(id)) fail('반을 선택해 주세요.');
    return doc(rooms, id);
  };
  const inYear = (id, generation, segment) => collection(db, 'classrooms', id, 'years', String(generation), segment);
  const cardsFor = owner => collection(db, 'curriculum', owner, 'cards');
  const roster = (id, generation) => query(students, where('roomId', '==', id), where('generation', '==', generation));
  const getData = async ref => (await getDocFromServer(ref)).data();
  const profileView = (profile, room) => ({
    classId: profile.roomId, generation: profile.generation, name: profile.nickname,
    grade: room.grade, classroom: room.label, number: profile.number, status: profile.status
  });
  const avatarView = (profile, state = characterState_(profile.state)) => ({
    nickname: profile.nickname,
    outfit: Object.fromEntries(Object.keys(CHARACTER_DEFAULTS_).map(slot => [slot, state[slot]])),
    badges: state.badges
  });
  const validEnrollment = (profile, room) => profile && room && !room.resetting && profile.generation === room.generation;

  async function readStudent(get = getDocFromServer) {
    const profile = (await get(profileRef)).data();
    const room = profile ? (await get(roomRef(profile.roomId))).data() : null;
    return { profile, room };
  }

  async function approvedStudent() {
    const { profile, room } = await readStudent();
    if (!validEnrollment(profile, room) || profile.status !== 'approved') fail('반 승인을 받은 뒤 다시 입장해 주세요.');
    return { profile, room };
  }

  async function ownRoom(id, get = getDocFromServer) {
    const room = (await get(roomRef(id))).data();
    if (room?.owner !== uid) fail('내가 등록한 반만 관리할 수 있어요.');
    return room;
  }

  async function additions(owner) {
    const snapshot = await getDocsFromServer(query(cardsFor(owner), limit(181)));
    return snapshot.docs.map(card => ({ id: card.id, ...card.data() }));
  }

  const actions = {
    async 'auth.profile'() {
      const { profile, room } = await readStudent();
      return { teacher: true, student: validEnrollment(profile, room) ? profileView(profile, room) : null };
    },

    async 'classroom.list'() {
      const snapshot = await getDocsFromServer(query(rooms, where('owner', '==', uid), limit(200)));
      return snapshot.docs.map(ref => {
        const { grade, label, generation, resetting } = ref.data();
        return { id: ref.id, grade, label, generation, resetting };
      });
    },

    async 'classroom.find'({ classId }) {
      const room = await getData(roomRef(classId));
      if (!room || room.resetting) return null;
      return { id: classId, grade: room.grade, label: room.label };
    },

    async 'classroom.register'({ grade, label }) {
      if (typeof grade !== 'string' || !/^[1-6]$/.test(grade)) fail('학년을 확인해 주세요.');
      label = cleanLabel(label, 60, '반 이름을 60자 이내로 입력해 주세요.');
      const id = (await digest([uid, grade, label])).slice(0, 32);
      const ref = roomRef(id);
      const room = { grade, label, generation: 0, resetting: false };
      await runTransaction(db, async tx => {
        if ((await tx.get(ref)).exists()) fail('이미 등록된 반이에요.');
        tx.set(ref, { ...room, owner: uid });
      });
      return { id, ...room };
    },

    async 'student.enter'({ classId, name, number }) {
      const selected = roomRef(classId);
      const nickname = cleanLabel(name, 30, '닉네임을 30자 이내로 입력해 주세요.');
      if (typeof number !== 'string' || !/^[0-9]{1,3}$/.test(number) || !Number(number)) fail('번호를 1~999 사이 숫자로 입력해 주세요.');
      const avatarId = crypto.randomUUID();
      return runTransaction(db, async tx => {
        const existing = (await tx.get(profileRef)).data();
        const room = (await tx.get(selected)).data();
        if (existing && existing.roomId !== classId) fail('이미 다른 반에 신청했어요. 담당 선생님께 문의해 주세요.');
        if (!room || room.resetting) fail('지금은 이 반에 들어갈 수 없어요.');
        if (existing) return profileView(existing, room);
        const profile = { roomId: classId, generation: room.generation, nickname, number, avatarId,
          status: 'pending', state: characterState_(null), devices: {}, createdAt: serverTimestamp() };
        tx.set(profileRef, profile);
        tx.set(doc(inYear(classId, room.generation, 'avatarOwners'), avatarId), { uid });
        return profileView(profile, room);
      });
    },

    async 'classroom.membership'({ scope, studentId, status }) {
      if (!['approved', 'rejected'].includes(status) || typeof studentId !== 'string' || !/^[\w-]{1,128}$/.test(studentId)) fail('신청 정보를 확인해 주세요.');
      const ref = doc(students, studentId);
      return runTransaction(db, async tx => {
        const room = await ownRoom(scope, tx.get.bind(tx));
        const profile = (await tx.get(ref)).data();
        if (profile?.roomId !== scope || !validEnrollment(profile, room) || profile.status !== 'pending') fail('처리할 참가 신청을 다시 확인해 주세요.');
        if (status === 'rejected') {
          tx.delete(ref);
          tx.delete(doc(inYear(scope, room.generation, 'avatarOwners'), profile.avatarId));
        } else {
          tx.update(ref, { status });
          tx.set(doc(inYear(scope, room.generation, 'avatars'), profile.avatarId), avatarView(profile));
        }
        return { ok: true };
      });
    },

    async 'classroom.avatars'() {
      const { profile } = await approvedStudent();
      const snapshot = await getDocsFromServer(query(inYear(profile.roomId, profile.generation, 'avatars'), limit(200)));
      return snapshot.docs.map(ref => ref.data()).sort((a, b) => a.nickname.localeCompare(b.nickname, 'ko'));
    },

    async 'classroom.characters'({ scope }) {
      const room = await ownRoom(scope);
      const [members, results] = await Promise.all([
        getDocsFromServer(query(roster(scope, room.generation), limit(200))),
        getCountFromServer(inYear(scope, room.generation, 'results'))
      ]);
      return { label: roomLabel(room), generation: room.generation, resetting: room.resetting,
        count: members.size, resultCount: results.data().count, students: members.docs.map(ref => {
          const profile = ref.data();
          const state = characterState_(profile.state);
          return { id: ref.id, nickname: profile.nickname, number: profile.number, status: profile.status,
            points: state.coins, badges: state.badges.length };
        }) };
    },

    async 'classroom.reset'({ scope, confirmation, generation }) {
      const ref = roomRef(scope);
      await runTransaction(db, async tx => {
        const room = await ownRoom(scope, tx.get.bind(tx));
        if (room.generation !== generation || confirmation !== roomLabel(room)) fail('삭제할 반과 기록을 다시 확인해 주세요.');
        if (!room.resetting) tx.update(ref, { resetting: true });
      });
      async function erase(source) {
        let removed = 0;
        for (let attempt = 0; attempt < 250; attempt++) {
          const page = await getDocsFromServer(query(source, limit(40)));
          if (page.empty) return removed;
          await runTransaction(db, async tx => {
            const room = await ownRoom(scope, tx.get.bind(tx));
            if (room.generation !== generation || !room.resetting) fail('반이 이미 초기화됐어요. 기록을 다시 확인해 주세요.');
            for (const item of page.docs) tx.delete(item.ref);
          });
          removed += page.size;
        }
        return fail('삭제가 진행 중이에요. 같은 반에서 다시 실행해 주세요.');
      }
      // The rules freeze enrollment and saves until all four queries are empty.
      // Deleting student documents last keeps the old profile until its avatar is gone.
      await erase(inYear(scope, generation, 'avatars'));
      await erase(inYear(scope, generation, 'avatarOwners'));
      const removedResults = await erase(inYear(scope, generation, 'results'));
      const removed = await erase(roster(scope, generation));
      await runTransaction(db, async tx => {
        const room = await ownRoom(scope, tx.get.bind(tx));
        if (room.generation !== generation || !room.resetting) fail('반이 이미 초기화됐어요. 기록을 다시 확인해 주세요.');
        tx.update(ref, { generation: generation + 1, resetting: false });
      });
      return { removed, removedResults };
    },

    async 'teacher.cards'() {
      return hanjaCatalog_('v2', await additions(uid)).grades;
    },

    async 'teacher.addCard'(input) {
      const card = validateTeacherCard_(input);
      const id = 'extra-' + card.grade + '-' + card.character.codePointAt(0).toString(16).padStart(4, '0');
      const existing = await additions(uid);
      if (existing.filter(entry => entry.grade === card.grade).length >= 30) fail('학년별로 30자까지 추가할 수 있어요.');
      if (hanjaCatalog_('v2', existing).grades[card.grade].cards.some(entry => entry.character === card.character)) fail('이미 등록된 한자예요.');
      await setDoc(doc(cardsFor(uid), id), card);
      return { id, ...card };
    },

    async 'hanja.mission'({ grade }) {
      if (!/^[1-6]$/.test(String(grade))) fail('학년을 확인해 주세요.');
      const { profile, room } = await approvedStudent();
      const draw = drawHanjaMission_(grade, await additions(room.owner));
      const missionId = crypto.randomUUID();
      missionCache.set(missionId, { ...draw, grade: String(grade), roomId: profile.roomId, generation: room.generation });
      if (missionCache.size > 10) missionCache.delete(missionCache.keys().next().value);
      return { ...draw, missionId };
    },

    async 'character.sync'({ generation, device, changes }) {
      if (!uuid(device) || !Array.isArray(changes) || changes.length > 60) fail('캐릭터 저장 요청을 확인해 주세요.');
      return runTransaction(db, async tx => {
        const { profile, room } = await readStudent(tx.get.bind(tx));
        if (!validEnrollment(profile, room) || profile.generation !== generation) return { reset: true };
        if (profile.status !== 'approved') fail('선생님의 반 승인이 필요해요.');
        const state = characterState_(profile.state);
        let accepted = profile.devices[device] || 0;
        const previous = accepted;
        let rejected = 0;
        for (const change of changes) {
          if (!Number.isSafeInteger(change?.seq) || change.seq < 1) fail('저장 순서를 확인해 주세요.');
          if (change.seq <= accepted) continue;
          if (change.seq !== accepted + 1) fail('저장 순서를 확인해 주세요.');
          // The browser awards cosmetic points. Rules isolate ownership and bound the saved fields.
          if (!applyCharacterChange_(state, change)) rejected += 1;
          accepted = change.seq;
        }
        if (accepted !== previous) {
          state.coins = Math.min(state.coins, 1000000);
          tx.update(profileRef, { state, devices: { ...profile.devices, [device]: accepted } });
          tx.set(doc(inYear(profile.roomId, generation, 'avatars'), profile.avatarId), avatarView(profile, state));
        }
        return { state, accepted, rejected };
      });
    },

    async 'student.submit'({ missionId, submissionId, answers }) {
      const { profile } = await approvedStudent();
      const mission = missionCache.get(missionId);
      if (!uuid(submissionId) || !mission || mission.roomId !== profile.roomId || mission.generation !== profile.generation ||
          !Array.isArray(answers) || answers.length !== mission.cards.length) fail('현재 퀴즈의 제출 내용을 확인해 주세요.');
      const remaining = new Map(mission.cards.map(card => [card.id, card]));
      let correctCount = 0;
      for (const answer of answers) {
        const card = remaining.get(answer?.questionId);
        if (!card || !card.options.some(option => option.id === answer.optionId)) fail('퀴즈 답을 확인해 주세요.');
        if (card.correctOptionId === answer.optionId) correctCount += 1;
        remaining.delete(card.id);
      }
      const fingerprint = await digest(answers.map(answer => [answer.questionId, answer.optionId]).sort());
      const result = doc(inYear(profile.roomId, profile.generation, 'results'), uid + '_' + missionId);
      return runTransaction(db, async tx => {
        const prior = (await tx.get(result)).data();
        if (prior) {
          if (prior.submissionId !== submissionId || prior.fingerprint !== fingerprint) fail('이 퀴즈는 이미 제출했어요.');
        } else {
          tx.set(result, { studentId: uid, missionId, submissionId, fingerprint, grade: mission.grade, correctCount,
            questionCount: mission.cards.length, createdAt: serverTimestamp() });
        }
        return { submissionId };
      });
    }
  };

  return async (action, payload = {}) => {
    if (!Object.hasOwn(actions, action)) fail('지원하지 않는 요청입니다.');
    return actions[action](payload);
  };
}
