---
marp: true
theme: default
paginate: true
header: "React + ASP.NET Core Web API Full Stack Development"
footer: "© 2024 RYU, Gyoung-Seok"
---

# React + ASP.NET Core Web API Full Stack Development

## 류경석(MCT)

---

## 과정 개요

1. React 소개와 개발 환경 설정
2. JSX와 컴포넌트
3. State와 생명주기
4. 고급 패턴과 성능 최적화
5. 실전 프로젝트와 추가 학습 자료

---

## 1. React 소개

- React란?
- 주요 특징
- Virtual DOM
- JSX 소개
- React의 장점

![bg right:40% 80%](https://via.placeholder.com/500x300?text=React+Logo)

---

## 2. 개발 환경 설정

- Node.js 및 npm 설치
- Visual Studio 2022 설정
- ASP.NET Core with React.js 템플릿
- 프로젝트 구조
- npm 스크립트

---

## 3. JSX 심화

- JSX 문법 규칙
- JavaScript 표현식 사용
- 조건부 렌더링
- 리스트 렌더링과 key prop
- JSX에서의 스타일링

```jsx
const element = <h1>Hello, {name}</h1>;
```

---

## 4. 컴포넌트와 Props

- 함수형 컴포넌트
- Props의 개념과 사용법
- 컴포넌트 합성
- children prop
- PropTypes

![bg right:40% 80%](https://via.placeholder.com/500x300?text=Component+Tree)

---

## 5. State와 생명주기

- useState 훅
- 상태 업데이트의 비동기성
- useEffect 훅
- 의존성 배열
- 클린업 함수

```jsx
const [count, setCount] = useState(0);
```

---

## 6. 이벤트 처리

- React의 합성 이벤트 시스템
- 이벤트 핸들러 작성
- 이벤트 객체 다루기
- preventDefault()
- 이벤트 위임

---

## 7. 조건부 렌더링과 리스트

- 조건부 렌더링 기법
- map() 함수를 이용한 리스트
- key prop의 중요성
- 리스트 필터링과 변환
- 동적 리스트 관리

---

## 8. 성능 최적화

- React.memo
- useMemo와 useCallback
- 코드 스플리팅과 지연 로딩
- 상태 정규화
- 가상화 (react-window)

![bg right:40% 80%](https://via.placeholder.com/500x300?text=Performance+Graph)

---

## 9. 고급 React 패턴

- Compound Components
- Render Props
- Higher-Order Components (HOC)
- 커스텀 훅
- Context API

---

## 10. Formik을 사용한 폼 관리

- Formik 소개 및 설정
- Formik 컴포넌트
- Yup을 이용한 유효성 검사
- 커스텀 폼 컨트롤
- 폼 제출 및 에러 처리

---

## 11. 상태 관리 라이브러리

- Redux 기본 개념
- Redux 액션, 리듀서, 스토어
- Redux Toolkit
- MobX 소개
- 라이브러리 비교

![bg right:40% 80%](https://via.placeholder.com/500x300?text=State+Management)

---

## 12. 서버 사이드 렌더링

- SSR의 장단점
- Next.js 소개
- getServerSideProps
- Static Site Generation (SSG)
- CSR vs SSR

---

## 13. 실전 프로젝트: 고급 Todo 앱

- 요구사항 정의
- 컴포넌트 구조 설계
- 상태 관리 전략
- API 연동 및 비동기 처리
- 성능 최적화 적용

---

## 14. 추가 학습 자료 및 리소스

- 공식 React 문서
- 추천 서적
- 유용한 온라인 강좌
- React 생태계 도구
- 커뮤니티 및 컨퍼런스

---

# 감사합니다!

질문과 토론의 시간