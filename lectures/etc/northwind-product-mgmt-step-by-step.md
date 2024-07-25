```
import React from 'react';
import { Container } from 'react-bootstrap';

const ProductManagementForm = () => {
  return (
    <Container className="mt-4">
      <h1>제품 관리</h1>
    </Container>
  );
};

export default ProductManagementForm;
```

```
import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Formik, Form } from 'formik';
import { Container, Row, Col, Button, Table, Modal, Form as BootstrapForm } from 'react-bootstrap';
import * as Yup from 'yup';

// API 함수들
const fetchProducts = async (page = 1) => {
  const response = await fetch(`/api/products?page=${page}`);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

// 여기에 다른 API 함수들을 추가합니다 (fetchCategories, fetchSuppliers, searchProducts, deleteProduct, saveProduct)

const ProductManagementForm = () => {
  return (
    <Container className="mt-4">
      <h1>제품 관리</h1>
    </Container>
  );
};

export default ProductManagementForm;
```

```
const ProductManagementForm = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showModal, setShowModal] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState(null);

  const { data: productsData } = useQuery(['products', currentPage], () => fetchProducts(currentPage));
  const { data: categories } = useQuery('categories', fetchCategories);
  const { data: suppliers } = useQuery('suppliers', fetchSuppliers);

  return (
    <Container className="mt-4">
      <h1>제품 관리</h1>
      {/* 여기에 나중에 폼과 테이블을 추가할 것입니다 */}
    </Container>
  );
};
```

```
const ProductManagementForm = () => {
  // ... (이전 코드)

  const searchMutation = useMutation(searchProducts, {
    onSuccess: (data) => {
      queryClient.setQueryData(['products', currentPage], data);
    },
  });

  const handleSearch = (values) => {
    searchMutation.mutate(values);
  };

  return (
    <Container className="mt-4">
      <h1>제품 관리</h1>
      <Formik
        initialValues={{ productName: '', categoryId: '', supplierId: '' }}
        onSubmit={handleSearch}
      >
        {({ handleSubmit, handleChange, values }) => (
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col xs={3}>
                <BootstrapForm.Control
                  name="productName"
                  value={values.productName}
                  onChange={handleChange}
                  placeholder="제품명"
                />
              </Col>
              <Col xs={3}>
                <BootstrapForm.Select
                  name="categoryId"
                  value={values.categoryId}
                  onChange={handleChange}
                >
                  <option value="">카테고리 선택</option>
                  {categories?.map(category => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </option>
                  ))}
                </BootstrapForm.Select>
              </Col>
              <Col xs={3}>
                <BootstrapForm.Select
                  name="supplierId"
                  value={values.supplierId}
                  onChange={handleChange}
                >
                  <option value="">공급업체 선택</option>
                  {suppliers?.map(supplier => (
                    <option key={supplier.supplierId} value={supplier.supplierId}>
                      {supplier.companyName}
                    </option>
                  ))}
                </BootstrapForm.Select>
              </Col>
              <Col xs={3}>
                <Button type="submit" variant="primary">검색</Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </Container>
  );
};
```

```
const ProductManagementForm = () => {
  // ... (이전 코드)

  const deleteMutation = useMutation(deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries(['products', currentPage]);
    },
  });

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(productId);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  return (
    <Container className="mt-4">
      {/* ... (이전 코드) */}
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>제품명</th>
            <th>카테고리</th>
            <th>공급업체</th>
            <th>단가</th>
            <th>재고</th>
            <th>주문량</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {productsData?.products.map(product => (
            <tr key={product.productId}>
              <td>{product.productId}</td>
              <td>{product.productName}</td>
              <td>{product.category.categoryName}</td>
              <td>{product.supplier.companyName}</td>
              <td>{product.unitPrice}</td>
              <td>{product.unitsInStock}</td>
              <td>{product.unitsOnOrder}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(product)}>수정</Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(product.productId)}>삭제</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};
```

```
const ProductManagementForm = () => {
  // ... (이전 코드)

  return (
    <Container className="mt-4">
      {/* ... (이전 코드) */}
      
      <Row className="mt-3">
        <Col className="d-flex justify-content-end">
          <Pagination>
            <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
            {[...Array(productsData?.totalPages || 0).keys()].map(number => (
              <Pagination.Item
                key={number + 1}
                active={number + 1 === currentPage}
                onClick={() => setCurrentPage(number + 1)}
              >
                {number + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, productsData?.totalPages || 1))} />
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};
```

```
const ProductManagementForm = () => {
  // ... (이전 코드)

  const saveMutation = useMutation(saveProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries(['products', currentPage]);
      setShowModal(false);
    },
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = (values, { setSubmitting }) => {
    saveMutation.mutate(values, {
      onSettled: () => setSubmitting(false)
    });
  };

  return (
    <Container className="mt-4">
      {/* ... (이전 코드) */}
      
      <Button variant="success" onClick={handleAddProduct}>제품 추가</Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? 'Edit Product' : 'Add New Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={editingProduct || {
              productName: '',
              categoryId: '',
              supplierId: '',
              unitPrice: '',
              unitsInStock: '',
              unitsOnOrder: '',
              reorderLevel: '',
              discontinued: false
            }}
            validationSchema={productSchema}
            onSubmit={handleSaveProduct}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <Form onSubmit={handleSubmit}>
                {/* 제품 정보 입력 필드들 */}
                {/* (제품명, 카테고리, 공급업체, 단가, 재고, 주문량, 재주문 수준, 단종 여부) */}
                <Button variant="primary" type="submit">Save</Button>
                <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </Container>
  );
};
```
