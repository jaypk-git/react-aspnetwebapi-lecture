﻿import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Container, Row, Col, Button, Table, Modal, Form as BootstrapForm, Pagination, Card } from 'react-bootstrap';
import * as Yup from 'yup';

import 'bootstrap/dist/css/bootstrap.min.css';
// API 함수들
const fetchProducts = async (page = 1) => {
    const response = await fetch(`/api/products?page=${page}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
};

const fetchCategories = async () => {
    const response = await fetch('/api/products/categories');
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
};

const fetchSuppliers = async () => {
    const response = await fetch('/api/products/suppliers');
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
};

const searchProducts = async (searchParams) => {
    const queryParams = new URLSearchParams(searchParams).toString();
    const response = await fetch(`/api/products/search?${queryParams}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
};

const deleteProduct = async (productId) => {
    const response = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
};

const saveProduct = async (product) => {
    const url = product.productId ? `/api/products/${product.productId}` : '/api/products';
    const method = product.productId ? 'PUT' : 'POST';
    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
};

// Validation schema
const productSchema = Yup.object().shape({
    productName: Yup.string().required('Product name is required'),
    categoryId: Yup.number().required('Category is required'),
    supplierId: Yup.number().required('Supplier is required'),
    unitPrice: Yup.number().positive('Unit price must be positive').required('Unit price is required'),
    unitsInStock: Yup.number().integer('Units in stock must be an integer').min(0, 'Units in stock must be non-negative').required('Units in stock is required'),
    unitsOnOrder: Yup.number().integer('Units on order must be an integer').min(0, 'Units on order must be non-negative').required('Units on order is required'),
    reorderLevel: Yup.number().integer('Reorder level must be an integer').min(0, 'Reorder level must be non-negative').required('Reorder level is required'),
    discontinued: Yup.boolean()
});


const ProductManagementForm = () => {
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = React.useState(1);
    const [showModal, setShowModal] = React.useState(false);
    const [editingProduct, setEditingProduct] = React.useState(null);

    const { data: productsData } = useQuery(['products', currentPage], () => fetchProducts(currentPage));
    const { data: categories } = useQuery('categories', fetchCategories);
    const { data: suppliers } = useQuery('suppliers', fetchSuppliers);

    const searchMutation = useMutation(searchProducts, {
        onSuccess: (data) => {
            queryClient.setQueryData(['products', currentPage], data);
        },
    });

    const deleteMutation = useMutation(deleteProduct, {
        onSuccess: () => {
            queryClient.invalidateQueries(['products', currentPage]);
        },
    });

    const saveMutation = useMutation(saveProduct, {
        onSuccess: () => {
            queryClient.invalidateQueries(['products', currentPage]);
            setShowModal(false);
        },
    });

    const handleSearch = (values) => {
        searchMutation.mutate(values);
    };

    const handleDelete = (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteMutation.mutate(productId);
        }
    };

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

    return (
        <Container className="mt-4">
            <Card>
                <Card.Header as="h5">제품 관리</Card.Header>
                <Card.Body>
                    <Formik
                        initialValues={{ productName: '', categoryId: '', supplierId: '' }}
                        onSubmit={handleSearch}
                    >
                        {({ handleSubmit, handleChange, values }) => (
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3 align-items-end">
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
                                        <Button type="submit" variant="primary" className="w-100">검색</Button>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>

                    <Table striped bordered hover>
                        <thead className="bg-light">
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

                    <Row className="mt-3">
                        <Col>
                            <Button variant="success" onClick={handleAddProduct}>제품 추가</Button>
                        </Col>
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
                </Card.Body>
            </Card>

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
        </Container>
    );
};

export default ProductManagementForm;
