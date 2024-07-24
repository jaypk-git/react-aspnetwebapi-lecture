# React modal window 예제

```
npm install react-bootstrap bootstrap
```

```jsx
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

// Bootstrap CSS를 import 합니다.
import 'bootstrap/dist/css/bootstrap.min.css';

function ModalExample() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        모달 열기
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>모달 제목</Modal.Title>
        </Modal.Header>
        <Modal.Body>여기에 모달의 내용을 넣으세요.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            닫기
          </Button>
          <Button variant="primary" onClick={handleClose}>
            저장
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalExample;

```

```javascript
import 'bootstrap/dist/css/bootstrap.min.css';
```

그런 다음 이 컴포넌트를 다른 컴포넌트나 페이지에서 import하여 사용할 수 있습니다:

```jsx
import ModalExample from './ModalExample';

function App() {
  return (
    <div className="App">
      <h1>React Bootstrap Modal 예제</h1>
      <ModalExample />
    </div>
  );
}
```
