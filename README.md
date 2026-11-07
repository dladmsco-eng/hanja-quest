# 한자 탐험대

초등학생이 학년별 한자를 20자씩 익히고, 다섯 가지 놀이에서 모은 포인트와 배지로 아바타를 꾸미는 웹앱입니다. 학생은 구글 계정으로 로그인하고, 교사의 승인을 받은 뒤 같은 반 아바타를 볼 수 있습니다. 교사는 학급과 학년별 추가 한자를 관리할 수 있습니다.

## 로컬 실행

Node.js 22에서 `node --test tests/*.test.cjs`로 백엔드 동작을 확인합니다. `node tools/build.mjs --preview`로 `dist/`에 로그인 설정이 없는 미리보기 파일을 만듭니다. 실제 구글 로그인 및 Firestore 연동 확인에는 별도 Firebase 프로젝트가 필요합니다.

## 운영 설정

1. Firebase 프로젝트에서 Firestore를 만들고 Authentication의 Google 제공업체를 켭니다. Authentication의 승인된 도메인에 `YOUR-GITHUB-OWNER.github.io`를 등록합니다.
2. Firebase 웹 앱을 추가하고 공개 웹 SDK 설정 JSON을 GitHub Actions 변수 `FIREBASE_WEB_CONFIG`에 넣습니다. 서비스 계정 JSON과 토큰은 여기에 넣지 않습니다.
3. `functions/.env.example`을 참고해 `functions/.env`에 정확한 `PAGES_ORIGIN`을 설정합니다. Cloud Functions 배포를 위해 프로젝트 소유자가 Blaze 요금제를 설정해야 합니다. `firebase deploy --only firestore:rules,functions --project PROJECT_ID`로 백엔드를 배포합니다.
4. 저장소 Settings → Pages의 배포 소스를 GitHub Actions로 설정한 뒤 `Deploy Hanja Quest` 워크플로를 실행합니다.
5. 운영자가 교사의 본인 확인을 마친 다음, Authentication 사용자 목록에서 해당 교사의 UID를 확인해 Firestore에 `staff/{UID}` 문서를 만들고 `role` 문자열을 `teacher`로 설정합니다. 승인을 철회하려면 이 문서를 삭제합니다. 교사 권한은 운영자가 Firebase 콘솔에서 발급합니다.

## 학생 기록

- 같은 구글 계정으로 로그인하면 아바타, 포인트, 아이템, 배지가 기기 간 이어집니다. 같은 반 갤러리에는 승인된 반 친구의 닉네임·아바타·배지만 표시됩니다.
- 교사는 자기 학급의 학생 프로필, 게임 진행 기록, 별도 활동 결과를 **학급 기록 초기화**에서 삭제할 수 있습니다. 확인 문구를 입력해야 실행됩니다. 학급 설정과 추가 한자는 유지됩니다. 다음 학기 학생은 다시 승인받습니다. Firebase Authentication의 구글 로그인 사용자와 기존 Apps Script 스프레드시트 기록은 이 작업의 범위에 포함되지 않습니다.
- 별도 활동 결과 제출은 초기 설정에서 꺼져 있습니다. 학교의 실제 운영 방식에 맞는 개인정보 안내와 보존 기간을 정한 뒤 서버의 `SUBMISSIONS_ENABLED`와 사이트의 개인정보 설정을 함께 적용합니다. 놀이의 포인트와 정답 기록은 평가 점수로 사용할 수 없습니다.
- 학급 이름에는 개인 이름이나 학생 연락처를 넣지 마세요. 구글에 로그인한 사용자는 가입 요청 전에도 등록된 학급 이름을 볼 수 있습니다.
