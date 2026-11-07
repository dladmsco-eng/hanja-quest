const config = await fetch(new URL('./firebase-config.json', import.meta.url)).then(response => response.json());
let auth;
let google;
let call;

if (config) {
  const sdk = 'https://www.gstatic.com/firebasejs/12.6.0/';
  const [{ initializeApp }, authSdk, functionsSdk] = await Promise.all([
    import(sdk + 'firebase-app.js'), import(sdk + 'firebase-auth.js'), import(sdk + 'firebase-functions.js')
  ]);
  const app = initializeApp(config);
  auth = authSdk.getAuth(app);
  google = authSdk;
  await authSdk.setPersistence(auth, authSdk.browserSessionPersistence);
  await auth.authStateReady();
  const functions = functionsSdk.getFunctions(app, 'asia-northeast3');
  call = functionsSdk.httpsCallable(functions, 'hanjaApi', { timeout: 190000 });
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
  },
  async call(action, payload) {
    if (!auth?.currentUser || !call) throw new Error('Google 계정으로 로그인해 주세요.');
    const reply = await call({ action, payload });
    return reply.data;
  }
};

await import('./app.js');
