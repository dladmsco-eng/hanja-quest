import { createSparkBackend } from './spark.js';
import * as game from './game.js';
import * as hanja from './hanja.js';

const config = await fetch(new URL('./firebase-config.json', import.meta.url)).then(response => response.json());
let auth;
let google;
let firestore;
let db;
let client;
let clientUid;

if (config) {
  const sdk = 'https://www.gstatic.com/firebasejs/13.2.0/';
  const [{ initializeApp }, authSdk, firestoreSdk] = await Promise.all([
    import(sdk + 'firebase-app.js'), import(sdk + 'firebase-auth.js'), import(sdk + 'firebase-firestore.js')
  ]);
  const app = initializeApp(config);
  auth = authSdk.getAuth(app);
  google = authSdk;
  await authSdk.setPersistence(auth, authSdk.browserSessionPersistence);
  await auth.authStateReady();
  firestore = firestoreSdk;
  db = firestore.getFirestore(app);
}

window.gameBackend = {
  current: () => auth?.currentUser?.uid || '',
  async login() {
    if (!auth) throw new Error('Firebase 웹 설정을 등록하면 Google 로그인을 사용할 수 있어요.');
    const provider = new google.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await google.signInWithPopup(auth, provider);
    return auth.currentUser.uid;
  },
  async logout() {
    if (auth) await google.signOut(auth);
    client = undefined;
    clientUid = undefined;
  },
  async call(action, payload) {
    const uid = auth?.currentUser?.uid;
    if (!uid || !db) throw new Error('Google 계정으로 로그인해 주세요.');
    if (uid !== clientUid) {
      client = createSparkBackend({ db, fs: firestore, uid, game, hanja });
      clientUid = uid;
    }
    return client(action, payload);
  }
};

await import('./app.js');
