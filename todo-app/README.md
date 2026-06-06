# Todo App

브라우저에서 바로 열 수 있는 투두리스트 앱입니다.

## 실행

1. `todo-app/index.html`을 브라우저에서 엽니다.
2. 또는 간단한 로컬 서버로 실행해도 됩니다.

## 구조

- `src/domain`: Todo 규칙과 필터 규칙
- `src/application`: 할 일 추가/수정/삭제 같은 유스케이스
- `src/infrastructure`: `localStorage` 저장소
- `src/presentation`: 화면 렌더링과 이벤트 처리

## 저장

- 데이터는 브라우저 `localStorage`에 저장됩니다.
- 새로고침해도 할 일이 유지됩니다.
