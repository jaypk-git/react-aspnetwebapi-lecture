## Product Controller
```C#
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly NorthwindContext _context;
        private const int PageSize = 10;

        public ProductsController(NorthwindContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts(int page = 1)
        {
            var query = _context.Products
                .Include(p => p.Category)
                .Include(p => p.Supplier);

            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)PageSize);

            var products = await query
                .Skip((page - 1) * PageSize)
                .Take(PageSize)
                .Select(p => new
                {
                    p.ProductId,
                    p.ProductName,
                    Category = new { p.Category.CategoryId, p.Category.CategoryName },
                    Supplier = new { p.Supplier.SupplierId, p.Supplier.CompanyName },
                    p.UnitPrice,
                    p.UnitsInStock,
                    p.UnitsOnOrder
                })
                .ToListAsync();

            return Ok(new { products, totalPages });
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchProducts(string productName, int? categoryId, int? supplierId, int page = 1)
        {
            var query = _context.Products
                .Include(p => p.Category)
                .Include(p => p.Supplier)
                .AsQueryable();

            if (!string.IsNullOrEmpty(productName))
                query = query.Where(p => p.ProductName.Contains(productName));

            if (categoryId.HasValue)
                query = query.Where(p => p.CategoryId == categoryId);

            if (supplierId.HasValue)
                query = query.Where(p => p.SupplierId == supplierId);

            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)PageSize);

            var products = await query
                .Skip((page - 1) * PageSize)
                .Take(PageSize)
                .Select(p => new
                {
                    p.ProductId,
                    p.ProductName,
                    Category = new { p.Category.CategoryId, p.Category.CategoryName },
                    Supplier = new { p.Supplier.SupplierId, p.Supplier.CompanyName },
                    p.UnitPrice,
                    p.UnitsInStock,
                    p.UnitsOnOrder
                })
                .ToListAsync();

            return Ok(new { products, totalPages });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories
                .Select(c => new { c.CategoryId, c.CategoryName })
                .ToListAsync();

            return Ok(categories);
        }

        [HttpGet("suppliers")]
        public async Task<IActionResult> GetSuppliers()
        {
            var suppliers = await _context.Suppliers
                .Select(s => new { s.SupplierId, s.CompanyName })
                .ToListAsync();

            return Ok(suppliers);
        }
    }
```
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
```
    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowModal(true);
    };

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

```

```
<Modal show={showModal} onHide={handleCloseModal}>
    <Modal.Header closeButton>
        <Modal.Title>{editingProduct ? 'Edit Product' : 'Add New Product'}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Formik
            initialValues={editingProduct ? {
                ...editingProduct,
                categoryId: editingProduct.category ? editingProduct.category.categoryId : '',
                supplierId: editingProduct.supplier ? editingProduct.supplier.supplierId : '',
            } : {
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
                    <BootstrapForm.Group className="mb-3">
                        <BootstrapForm.Label>Product Name</BootstrapForm.Label>
                        <BootstrapForm.Control
                            type="text"
                            name="productName"
                            value={values.productName}
                            onChange={handleChange}
                            isInvalid={touched.productName && errors.productName}
                        />
                        <BootstrapForm.Control.Feedback type="invalid">
                            {errors.productName}
                        </BootstrapForm.Control.Feedback>
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="mb-3">
                        <BootstrapForm.Label>Category</BootstrapForm.Label>
                        <BootstrapForm.Select
                            name="categoryId"
                            value={values.categoryId}
                            onChange={handleChange}
                            isInvalid={touched.categoryId && errors.categoryId}
                        >
                            <option value="">Select Category</option>
                            {categories?.map(category => (
                                <option key={category.categoryId} value={category.categoryId}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </BootstrapForm.Select>
                        <BootstrapForm.Control.Feedback type="invalid">
                            {errors.categoryId}
                        </BootstrapForm.Control.Feedback>
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="mb-3">
                        <BootstrapForm.Label>Supplier</BootstrapForm.Label>
                        <BootstrapForm.Select
                            name="supplierId"
                            value={values.supplierId}
                            onChange={handleChange}
                            isInvalid={touched.supplierId && errors.supplierId}
                        >
                            <option value="">Select Supplier</option>
                            {suppliers?.map(supplier => (
                                <option key={supplier.supplierId} value={supplier.supplierId}>
                                    {supplier.companyName}
                                </option>
                            ))}
                        </BootstrapForm.Select>
                        <BootstrapForm.Control.Feedback type="invalid">
                            {errors.supplierId}
                        </BootstrapForm.Control.Feedback>
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="mb-3">
                        <BootstrapForm.Label>Unit Price</BootstrapForm.Label>
                        <BootstrapForm.Control
                            type="number"
                            step="0.01"
                            name="unitPrice"
                            value={values.unitPrice}
                            onChange={handleChange}
                            isInvalid={touched.unitPrice && errors.unitPrice}
                        />
                        <BootstrapForm.Control.Feedback type="invalid">
                            {errors.unitPrice}
                        </BootstrapForm.Control.Feedback>
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="mb-3">
                        <BootstrapForm.Label>Units In Stock</BootstrapForm.Label>
                        <BootstrapForm.Control
                            type="number"
                            name="unitsInStock"
                            value={values.unitsInStock}
                            onChange={handleChange}
                            isInvalid={touched.unitsInStock && errors.unitsInStock}
                        />
                        <BootstrapForm.Control.Feedback type="invalid">
                            {errors.unitsInStock}
                        </BootstrapForm.Control.Feedback>
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="mb-3">
                        <BootstrapForm.Label>Units On Order</BootstrapForm.Label>
                        <BootstrapForm.Control
                            type="number"
                            name="unitsOnOrder"
                            value={values.unitsOnOrder}
                            onChange={handleChange}
                            isInvalid={touched.unitsOnOrder && errors.unitsOnOrder}
                        />
                        <BootstrapForm.Control.Feedback type="invalid">
                            {errors.unitsOnOrder}
                        </BootstrapForm.Control.Feedback>
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="mb-3">
                        <BootstrapForm.Label>Reorder Level</BootstrapForm.Label>
                        <BootstrapForm.Control
                            type="number"
                            name="reorderLevel"
                            value={values.reorderLevel}
                            onChange={handleChange}
                            isInvalid={touched.reorderLevel && errors.reorderLevel}
                        />
                        <BootstrapForm.Control.Feedback type="invalid">
                            {errors.reorderLevel}
                        </BootstrapForm.Control.Feedback>
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="mb-3">
                        <BootstrapForm.Check
                            type="checkbox"
                            label="Discontinued"
                            name="discontinued"
                            checked={values.discontinued}
                            onChange={handleChange}
                        />
                    </BootstrapForm.Group>

                    <Button variant="primary" type="submit">
                        Save
                    </Button>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                </Form>
            )}
        </Formik>
    </Modal.Body>
</Modal>

```
