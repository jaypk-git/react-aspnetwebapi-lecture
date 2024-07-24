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
            Open Modal
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Title</Modal.Title>
                </Modal.Header>
                <Modal.Body>Modal content</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save
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
      <h1>React Bootstrap Modal Example</h1>
      <ModalExample />
    </div>
  );
}
```
