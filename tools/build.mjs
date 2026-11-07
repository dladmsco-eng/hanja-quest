import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { CHARACTER_DEFAULTS_, CHARACTER_ITEMS_ } from '../functions/game.cjs';

const read = file => readFile(new URL('../web/' + file, import.meta.url), 'utf8');
const write = (file, content) => writeFile(new URL('../dist/' + file, import.meta.url), content);
const moduleSource = async name => {
  const source = await readFile(new URL('../functions/' + name + '.cjs', import.meta.url), 'utf8');
  const browserModule = source.replace(/^module\.exports = \{ (.+) \};$/m, 'export { $1 };');
  if (source === browserModule) throw new Error('Missing module exports for ' + name);
  return browserModule;
};
const preview = process.argv.includes('--preview');
const incoming = JSON.parse(process.env.FIREBASE_WEB_CONFIG || '{}');
const firebase = Object.fromEntries(['apiKey', 'authDomain', 'projectId', 'appId'].filter(key => typeof incoming[key] === 'string').map(key => [key, incoming[key]]));
const configured = /^[a-z0-9-]{6,30}$/.test(firebase.projectId || '') &&
  firebase.authDomain === firebase.projectId + '.firebaseapp.com' &&
  /^AIza[0-9A-Za-z_-]{30,}$/.test(firebase.apiKey || '') && /^1:[0-9]+:web:[a-f0-9]+$/.test(firebase.appId || '');
if (!configured && !preview) throw new Error('FIREBASE_WEB_CONFIG에 등록한 Firebase 웹 앱의 공개 설정이 필요합니다.');

const policy = JSON.parse(process.env.PRIVACY_PUBLIC_CONFIG || '{}');
const privacy = Object.fromEntries(['controller', 'retention', 'contact'].map(key => [key, typeof policy[key] === 'string' ? policy[key].slice(0, 180) : '']));
privacy.enabled = policy.enabled === true && Object.values(privacy).every(Boolean);
const boot = { hanja: { version: 'v2', grades: [1, 2, 3, 4, 5, 6] }, classrooms: [], privacy, characterItems: CHARACTER_ITEMS_, characterDefaults: CHARACTER_DEFAULTS_ };
const config = configured ? firebase : null;
const [template, styles, client, firebaseClient] = await Promise.all(['Index.html', 'Styles.html', 'Client.html', 'firebase-client.js'].map(read));
const scriptPolicy = "script-src 'self' https://www.gstatic.com https://apis.google.com";
const destinations = configured ? ' https://' + firebase.authDomain + ' https://firestore.googleapis.com' : '';
const csp = [
  "default-src 'self'", scriptPolicy, "style-src 'self'", "img-src 'self' data:", "object-src 'none'",
  "base-uri 'none'", "form-action 'self'", "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com" + destinations,
  'frame-src https://accounts.google.com' + (configured ? ' https://' + firebase.authDomain : '')
].join('; ');
const html = template.replace(/<base[^>]*>/, '<meta name="viewport" content="width=device-width,initial-scale=1">')
  .replace("<"+"?!= include_('Styles') ?>", '<meta http-equiv="Content-Security-Policy" content="' + csp + '">\n  <link rel="stylesheet" href="./styles.css">')
  .replace("<"+"?!= boot ?>", () => JSON.stringify(boot).replaceAll('<', '\\u003c'))
  .replace("<"+"?!= include_('Client') ?>", '<script type="module" src="./firebase-client.js"></script>');
await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
await Promise.all([
  write('index.html', html),
  write('styles.css', styles.replace(/^<style>|<\/style>\s*$/g, '')),
  write('app.js', client.replace(/^<script>|<\/script>\s*$/g, '')),
  write('firebase-client.js', firebaseClient),
  write('spark.js', await read('spark.mjs')),
  write('game.js', await moduleSource('game')),
  write('hanja.js', await moduleSource('hanja')),
  write('firebase-config.json', JSON.stringify(config)),
  write('.nojekyll', '')
]);
