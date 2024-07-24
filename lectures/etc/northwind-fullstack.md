# Northwind 제품 관리 폼
![product-management-form](https://github.com/user-attachments/assets/a1497741-5120-4f84-84e7-0234c987c557)
```C#
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using YourNamespace.Models;
using YourNamespace.Data;

[ApiController]
[Route("api/[controller]")]
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
```
npm install react-bootstrap bootstrap formik axios
```

```jsx
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
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
    fetchProducts();
    fetchCategories();
    fetchSuppliers();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`/api/products?page=${currentPage}`);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('/api/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleSearch = async (values) => {
    try {
      const response = await axios.get('/api/products/search', { params: values });
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const handleEdit = (productId) => {
    // Implement edit functionality
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`/api/products/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleAddProduct = () => {
    // Implement add product functionality
  };

  return (
    <Container className="mt-4">
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
    </Container>
  );
};

export default ProductManagementForm;
```
![product-modal-form](https://github.com/user-attachments/assets/f9a91a07-4f4d-40a9-9271-2138cc36070a)


