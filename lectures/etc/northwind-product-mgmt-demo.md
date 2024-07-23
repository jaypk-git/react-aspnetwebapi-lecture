
## 초기 폼

```javascript
import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import axios from 'axios';
import { 
  Table, 
  Button, 
  Form as BootstrapForm, 
  Container, 
  Row, 
  Col, 
  Pagination 
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductManagementForm = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Step 1: Fetch initial data
  }, [currentPage]);

  const fetchProducts = async () => {
    // Step 2: Implement fetchProducts
  };

  const fetchCategories = async () => {
    // Step 3: Implement fetchCategories
  };

  const fetchSuppliers = async () => {
    // Step 4: Implement fetchSuppliers
  };

  const handleSearch = async (values) => {
    // Step 5: Implement handleSearch
  };

  const handleEdit = (productId) => {
    // Step 6: Implement handleEdit
  };

  const handleDelete = async (productId) => {
    // Step 7: Implement handleDelete
  };

  const handleAddProduct = () => {
    // Step 8: Implement handleAddProduct
  };

  return (
    <Container className="mt-4">
      {/* Step 9: Implement search form */}
      
      {/* Step 10: Implement product table */}
      
      {/* Step 11: Implement pagination and add product button */}
    </Container>
  );
};

export default ProductManagementForm;

```

이제 각 단계별 스크립트와 코드를 제공하겠습니다:

1단계: 초기 데이터 가져오기
스크립트: "먼저, 컴포넌트가 마운트될 때 초기 데이터를 가져오는 useEffect 훅을 구현합니다."

```javascript
useEffect(() => {
  fetchProducts();
  fetchCategories();
  fetchSuppliers();
}, [currentPage]);
```

2단계: fetchProducts 구현
스크립트: "제품 목록을 가져오는 fetchProducts 함수를 구현합니다. 이 함수는 현재 페이지에 해당하는 제품을 가져옵니다."

```javascript
const fetchProducts = async () => {
  try {
    const response = await axios.get(`/api/products?page=${currentPage}`);
    setProducts(response.data.products);
    setTotalPages(response.data.totalPages);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
```

3단계: fetchCategories 구현
스크립트: "카테고리 목록을 가져오는 fetchCategories 함수를 구현합니다."

```javascript
const fetchCategories = async () => {
  try {
    const response = await axios.get('/api/categories');
    setCategories(response.data);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};
```

4단계: fetchSuppliers 구현
스크립트: "공급업체 목록을 가져오는 fetchSuppliers 함수를 구현합니다."

```javascript
const fetchSuppliers = async () => {
  try {
    const response = await axios.get('/api/suppliers');
    setSuppliers(response.data);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
  }
};
```

5단계: handleSearch 구현
스크립트: "검색 기능을 구현하는 handleSearch 함수를 만듭니다."

```javascript
const handleSearch = async (values) => {
  try {
    const response = await axios.get('/api/products/search', { params: values });
    setProducts(response.data.products);
    setTotalPages(response.data.totalPages);
  } catch (error) {
    console.error('Error searching products:', error);
  }
};
```

6단계: handleEdit 구현
스크립트: "제품 수정 기능을 구현하는 handleEdit 함수를 만듭니다. 이 데모에서는 간단히 로그만 출력하겠습니다."

```javascript
const handleEdit = (productId) => {
  console.log(`Editing product with ID: ${productId}`);
  // 실제 구현에서는 여기에 수정 로직을 추가합니다.
};
```

7단계: handleDelete 구현
스크립트: "제품 삭제 기능을 구현하는 handleDelete 함수를 만듭니다."

```javascript
const handleDelete = async (productId) => {
  try {
    await axios.delete(`/api/products/${productId}`);
    fetchProducts();
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};
```

8단계: handleAddProduct 구현
스크립트: "새 제품 추가 기능을 구현하는 handleAddProduct 함수를 만듭니다. 이 데모에서는 간단히 로그만 출력하겠습니다."

```javascript
const handleAddProduct = () => {
  console.log('Adding a new product');
  // 실제 구현에서는 여기에 제품 추가 로직을 구현합니다.
};
```

9단계: 검색 폼 구현
스크립트: "이제 검색 폼을 구현합니다. Formik을 사용하여 폼을 관리하고, React-Bootstrap 컴포넌트를 사용하여 UI를 구성합니다."

```javascript
<Formik
  initialValues={{ productName: '', categoryId: '', supplierId: '' }}
  onSubmit={handleSearch}
>
  {({ values, handleChange, handleSubmit }) => (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Col>
          <BootstrapForm.Control
            name="productName"
            value={values.productName}
            onChange={handleChange}
            placeholder="Product Name"
          />
        </Col>
        <Col>
          <BootstrapForm.Select
            name="categoryId"
            value={values.categoryId}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </BootstrapForm.Select>
        </Col>
        <Col>
          <BootstrapForm.Select
            name="supplierId"
            value={values.supplierId}
            onChange={handleChange}
          >
            <option value="">Select Supplier</option>
            {suppliers.map(supplier => (
              <option key={supplier.supplierId} value={supplier.supplierId}>
                {supplier.companyName}
              </option>
            ))}
          </BootstrapForm.Select>
        </Col>
        <Col>
          <Button type="submit">Search</Button>
        </Col>
      </Row>
    </Form>
  )}
</Formik>
```

10단계: 제품 테이블 구현
스크립트: "제품 목록을 보여주는 테이블을 구현합니다."

```javascript
<Table striped bordered hover>
  <thead>
    <tr>
      <th>ID</th>
      <th>Product Name</th>
      <th>Category</th>
      <th>Supplier</th>
      <th>Unit Price</th>
      <th>Units In Stock</th>
      <th>Units On Order</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {products.map(product => (
      <tr key={product.productId}>
        <td>{product.productId}</td>
        <td>{product.productName}</td>
        <td>{product.category.categoryName}</td>
        <td>{product.supplier.companyName}</td>
        <td>{product.unitPrice}</td>
        <td>{product.unitsInStock}</td>
        <td>{product.unitsOnOrder}</td>
        <td>
          <Button variant="primary" className="me-2" onClick={() => handleEdit(product.productId)}>Edit</Button>
          <Button variant="danger" onClick={() => handleDelete(product.productId)}>Delete</Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>
```

11단계: 페이지네이션 및 제품 추가 버튼 구현
스크립트: "마지막으로, 페이지네이션과 새 제품 추가 버튼을 구현합니다."

```javascript
<Row className="mt-3">
  <Col>
    <Button variant="success" onClick={handleAddProduct}>Add Product</Button>
  </Col>
  <Col className="d-flex justify-content-end">
    <Pagination>
      {[...Array(totalPages).keys()].map(number => (
        <Pagination.Item 
          key={number + 1} 
          active={number + 1 === currentPage}
          onClick={() => setCurrentPage(number + 1)}
        >
          {number + 1}
        </Pagination.Item>
      ))}
    </Pagination>
  </Col>
</Row>
```

이렇게 11단계로 나누어 데모를 진행할 수 있습니다. 각 단계에서 코드를 추가하면서 기능을 설명하고, 최종적으로 완성된 제품 관리 폼을 보여줄 수 있습니다.