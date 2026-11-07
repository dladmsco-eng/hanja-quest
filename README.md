# 한자 탐험대

초등학생이 학년별 한자를 20자씩 익히고, 다섯 가지 놀이에서 모은 포인트와 배지로 아바타를 꾸미는 웹앱입니다. 학생은 구글 계정으로 로그인하고, 교사의 승인을 받은 뒤 같은 반 아바타를 볼 수 있습니다. 교사는 학급과 학년별 추가 한자를 관리할 수 있습니다.

## 로컬 실행

Node.js 22에서 `node tools/build.mjs --preview`로 미리보기를 빌드합니다. Java 21 이상에서 `npm ci` 후 `firebase emulators:exec --only firestore --project demo-hanja-quest "node --test tests/spark.emulator.cjs"`로 학급 권한과 삭제를 검증합니다.

## 운영 설정

1. Firebase 프로젝트에서 Firestore를 만들고 Authentication의 Google 제공업체를 켭니다. Authentication의 승인된 도메인에 `YOUR-GITHUB-OWNER.github.io`를 등록합니다.
2. Firebase 웹 앱을 추가하고 공개 웹 SDK 설정 JSON을 GitHub Actions 변수 `FIREBASE_WEB_CONFIG`에 넣습니다. 서비스 계정 JSON과 토큰은 여기에 넣지 않습니다.
3. `firebase deploy --only firestore:rules --project PROJECT_ID`로 Firestore 보안 규칙을 배포합니다. 웹앱은 Firebase Spark 요금제와 호환되며, 사용량은 프로젝트 무료 한도의 적용을 받습니다.
4. 저장소 Settings → Pages의 배포 소스를 GitHub Actions로 설정한 뒤 `Deploy Hanja Quest` 워크플로를 실행합니다.
5. Google 로그인 후 **학급·한자 관리**에서 반을 만들고 **학급 링크 복사**로 학생에게 링크를 전달합니다. 누구나 자기 학급을 관리할 수 있고, 학생은 링크에서 번호와 닉네임을 입력한 뒤 해당 학급을 만든 계정의 승인을 기다립니다.

## 학생 기록

- 같은 구글 계정으로 로그인하면 아바타, 포인트, 아이템, 배지가 기기 간 이어집니다. 같은 반 갤러리에는 승인된 반 친구의 닉네임·아바타·배지만 표시됩니다.
- 교사는 자기 학급의 학생 프로필, 게임 진행 기록, 별도 활동 결과를 **학급 기록 초기화**에서 삭제할 수 있습니다. 확인 문구를 입력해야 실행됩니다. 학급 설정과 추가 한자는 유지됩니다. 다음 학기 학생은 다시 승인받습니다. Firebase Authentication의 구글 로그인 사용자와 기존 Apps Script 스프레드시트 기록은 이 작업의 범위에 포함되지 않습니다.
- 별도 활동 결과 제출은 초기 설정에서 꺼져 있습니다. 개인정보 안내와 보존 기간을 정한 뒤 Firestore의 `settings/activity`에 불리언 `submissionsEnabled: true`를 설정하고 사이트의 개인정보 설정을 함께 적용합니다. 놀이 포인트와 퀴즈 결과는 브라우저가 계산하므로 공식 평가에 사용하지 마세요.
- 학급 이름에는 개인 이름이나 학생 연락처를 넣지 마세요. 링크를 받은 구글 로그인 사용자가 참가 신청 전에 볼 수 있습니다. 학급 목록은 각 계정이 만든 반만 표시합니다.
