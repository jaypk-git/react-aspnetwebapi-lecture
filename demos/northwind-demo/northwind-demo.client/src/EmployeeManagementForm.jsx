import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Container, Row, Col, Button, Table, Modal, Form as BootstrapForm, Pagination, Card } from 'react-bootstrap';
import * as Yup from 'yup';

import 'bootstrap/dist/css/bootstrap.min.css';

// API 함수들
const fetchEmployees = async (page = 1) => {
    const response = await fetch(`/api/employees?page=${page}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
};

const searchEmployees = async (searchParams) => {
    const queryParams = new URLSearchParams(searchParams).toString();
    const response = await fetch(`/api/employees/search?${queryParams}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
};

const deleteEmployee = async (employeeId) => {
    const response = await fetch(`/api/employees/${employeeId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
};

const saveEmployee = async (employee) => {
    const url = employee.employeeId ? `/api/employees/${employee.employeeId}` : '/api/employees';
    const method = employee.employeeId ? 'PUT' : 'POST';
    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
};

// Validation schema
const employeeSchema = Yup.object().shape({
    lastName: Yup.string().required('Last name is required'),
    firstName: Yup.string().required('First name is required'),
    title: Yup.string().required('Title is required'),
    titleOfCourtesy: Yup.string().required('Title of courtesy is required'),
    birthDate: Yup.date().required('Birth date is required'),
    hireDate: Yup.date().required('Hire date is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    region: Yup.string(),
    postalCode: Yup.string().required('Postal code is required'),
    country: Yup.string().required('Country is required'),
    homePhone: Yup.string().required('Home phone is required'),
    extension: Yup.string(),
    notes: Yup.string()
});

const EmployeeManagementForm = () => {
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = React.useState(1);
    const [showModal, setShowModal] = React.useState(false);
    const [editingEmployee, setEditingEmployee] = React.useState(null);

    const { data: employeesData } = useQuery(['employees', currentPage], () => fetchEmployees(currentPage));

    const searchMutation = useMutation(searchEmployees, {
        onSuccess: (data) => {
            queryClient.setQueryData(['employees', currentPage], data);
        },
    });

    const deleteMutation = useMutation(deleteEmployee, {
        onSuccess: () => {
            queryClient.invalidateQueries(['employees', currentPage]);
        },
    });

    const saveMutation = useMutation(saveEmployee, {
        onSuccess: () => {
            queryClient.invalidateQueries(['employees', currentPage]);
            setShowModal(false);
        },
    });

    const handleSearch = (values) => {
        searchMutation.mutate(values);
    };

    const handleDelete = (employeeId) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            deleteMutation.mutate(employeeId);
        }
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setShowModal(true);
    };

    const handleAddEmployee = () => {
        setEditingEmployee(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingEmployee(null);
    };

    const handleSaveEmployee = (values, { setSubmitting }) => {
        saveMutation.mutate(values, {
            onSettled: () => setSubmitting(false)
        });
    };

    return (
        <Container className="mt-4">
            <Card>
                <Card.Header as="h5">직원 관리</Card.Header>
                <Card.Body>
                    <Formik
                        initialValues={{ lastName: '', firstName: '', title: '' }}
                        onSubmit={handleSearch}
                    >
                        {({ handleSubmit, handleChange, values }) => (
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3 align-items-end">
                                    <Col xs={3}>
                                        <BootstrapForm.Control
                                            name="lastName"
                                            value={values.lastName}
                                            onChange={handleChange}
                                            placeholder="성"
                                        />
                                    </Col>
                                    <Col xs={3}>
                                        <BootstrapForm.Control
                                            name="firstName"
                                            value={values.firstName}
                                            onChange={handleChange}
                                            placeholder="이름"
                                        />
                                    </Col>
                                    <Col xs={3}>
                                        <BootstrapForm.Control
                                            name="title"
                                            value={values.title}
                                            onChange={handleChange}
                                            placeholder="직책"
                                        />
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
                                <th>성명</th>
                                <th>직책</th>
                                <th>고용일</th>
                                <th>도시</th>
                                <th>국가</th>
                                <th>작업</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeesData?.employees.map(employee => (
                                <tr key={employee.employeeId}>
                                    <td>{employee.employeeId}</td>
                                    <td>{`${employee.lastName}, ${employee.firstName}`}</td>
                                    <td>{employee.title}</td>
                                    <td>{new Date(employee.hireDate).toLocaleDateString()}</td>
                                    <td>{employee.city}</td>
                                    <td>{employee.country}</td>
                                    <td>
                                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(employee)}>수정</Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(employee.employeeId)}>삭제</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Row className="mt-3">
                        <Col>
                            <Button variant="success" onClick={handleAddEmployee}>직원 추가</Button>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            <Pagination>
                                <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
                                {[...Array(employeesData?.totalPages || 0).keys()].map(number => (
                                    <Pagination.Item
                                        key={number + 1}
                                        active={number + 1 === currentPage}
                                        onClick={() => setCurrentPage(number + 1)}
                                    >
                                        {number + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, employeesData?.totalPages || 1))} />
                            </Pagination>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editingEmployee ? '직원 정보 수정' : '새 직원 추가'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={editingEmployee || {
                            lastName: '',
                            firstName: '',
                            title: '',
                            titleOfCourtesy: '',
                            birthDate: '',
                            hireDate: '',
                            address: '',
                            city: '',
                            region: '',
                            postalCode: '',
                            country: '',
                            homePhone: '',
                            extension: '',
                            notes: ''
                        }}
                        validationSchema={employeeSchema}
                        onSubmit={handleSaveEmployee}
                    >
                        {({ handleSubmit, handleChange, values, touched, errors }) => (
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>성</BootstrapForm.Label>
                                            <BootstrapForm.Control
                                                type="text"
                                                name="lastName"
                                                value={values.lastName}
                                                onChange={handleChange}
                                                isInvalid={touched.lastName && errors.lastName}
                                            />
                                            <BootstrapForm.Control.Feedback type="invalid">
                                                {errors.lastName}
                                            </BootstrapForm.Control.Feedback>
                                        </BootstrapForm.Group>
                                    </Col>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>이름</BootstrapForm.Label>
                                            <BootstrapForm.Control
                                                type="text"
                                                name="firstName"
                                                value={values.firstName}
                                                onChange={handleChange}
                                                isInvalid={touched.firstName && errors.firstName}
                                            />
                                            <BootstrapForm.Control.Feedback type="invalid">
                                                {errors.firstName}
                                            </BootstrapForm.Control.Feedback>
                                        </BootstrapForm.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>직책</BootstrapForm.Label>
                                            <BootstrapForm.Control
                                                type="text"
                                                name="title"
                                                value={values.title}
                                                onChange={handleChange}
                                                isInvalid={touched.title && errors.title}
                                            />
                                            <BootstrapForm.Control.Feedback type="invalid">
                                                {errors.title}
                                            </BootstrapForm.Control.Feedback>
                                        </BootstrapForm.Group>
                                    </Col>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>직책 호칭</BootstrapForm.Label>
                                            <BootstrapForm.Control
                                                type="text"
                                                name="titleOfCourtesy"
                                                value={values.titleOfCourtesy}
                                                onChange={handleChange}
                                                isInvalid={touched.titleOfCourtesy && errors.titleOfCourtesy}
                                            />
                                            <BootstrapForm.Control.Feedback type="invalid">
                                                {errors.titleOfCourtesy}
                                            </BootstrapForm.Control.Feedback>
                                        </BootstrapForm.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>생년월일</BootstrapForm.Label>
                                            <BootstrapForm.Control
                                                type="date"
                                                name="birthDate"
                                                value={values.birthDate}
                                                onChange={handleChange}
                                                isInvalid={touched.birthDate && errors.birthDate}
                                            />
                                            <BootstrapForm.Control.Feedback type="invalid">
                                                {errors.birthDate}
                                            </BootstrapForm.Control.Feedback>
                                        </BootstrapForm.Group>
                                    </Col>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>고용일</BootstrapForm.Label>
                                            <BootstrapForm.Control
                                                type="date"
                                                name="hireDate"
                                                value={values.hireDate}
                                                onChange={handleChange}
                                                isInvalid={touched.hireDate && errors.hireDate}
                                            />
                                            <BootstrapForm.Control.Feedback type="invalid">
                                                {errors.hireDate}
                                            </BootstrapForm.Control.Feedback>
                                        </BootstrapForm.Group>
                                    </Col>
                                </Row>

                                <BootstrapForm.Group className="mb-3">
                                    <BootstrapForm.Label>주소</BootstrapForm.Label>
                                    <BootstrapForm.Control
                                        type="text"
                                        name="address"
                                        value={values.address}
                                        onChange={handleChange}
                                        isInvalid={touched.address && errors.address}
                                    />
                                    <BootstrapForm.Control.Feedback type="invalid">
                                        {errors.address}
                                    </BootstrapForm.Control.Feedback>
                                </BootstrapForm.Group>

                                <Row>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>도시</BootstrapForm.Label>
                                            <BootstrapForm.Control
                                                type="text"
                                                name="city"
                                                value={values.city}
                                                onChange={handleChange}
                                                isInvalid={touched.city && errors.city}
                                            />
                                            <BootstrapForm.Control.Feedback type="invalid">
                                                {errors.city}
                                            </BootstrapForm.Control.Feedback>
                                        </BootstrapForm.Group>
                                    </Col>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>지역</BootstrapForm.Label>
                                            <BootstrapForm.Control
                                                type="text"
                                                name="region"
                                                value={values.region}
                                                onChange={handleChange}
                                                isInvalid={touched.region && errors.region}
                                            />
                                            <BootstrapForm.Control.Feedback type="invalid">
                                                {errors.region}
                                            </BootstrapForm.Control.Feedback>
                                        </BootstrapForm.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>우편번호</BootstrapForm.Label>
                                            <BootstrapForm.Control
                                                type="text"
                                                name="postalCode"
                                                value={values.postalCode}
                                                onChange={handleChange}
                                                isInvalid={touched.postalCode && errors.postalCode}
                                            />
                                            <BootstrapForm.Control.Feedback type="invalid">
                                                {errors.postalCode}
                                            </BootstrapForm.Control.Feedback>
                                        </BootstrapForm.Group>
                                    </Col>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>국가</BootstrapForm.Label>
                                            <BootstrapForm.Control
                                                type="text"
                                                name="country"
                                                value={values.country}
                                                onChange={handleChange}
                                                isInvalid={touched.country && errors.country}
                                            />
                                            <BootstrapForm.Control.Feedback type="invalid">
                                                {errors.country}
                                            </BootstrapForm.Control.Feedback>
                                        </BootstrapForm.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>집 전화번호</BootstrapForm.Label>
                                            <BootstrapForm.Control
                                                type="text"
                                                name="homePhone"
                                                value={values.homePhone}
                                                onChange={handleChange}
                                                isInvalid={touched.homePhone && errors.homePhone}
                                            />
                                            <BootstrapForm.Control.Feedback type="invalid">
                                                {errors.homePhone}
                                            </BootstrapForm.Control.Feedback>
                                        </BootstrapForm.Group>
                                    </Col>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>내선 번호</BootstrapForm.Label>
                                            <BootstrapForm.Control
                                                type="text"
                                                name="extension"
                                                value={values.extension}
                                                onChange={handleChange}
                                                isInvalid={touched.extension && errors.extension}
                                            />
                                            <BootstrapForm.Control.Feedback type="invalid">
                                                {errors.extension}
                                            </BootstrapForm.Control.Feedback>
                                        </BootstrapForm.Group>
                                    </Col>
                                </Row>

                                <BootstrapForm.Group className="mb-3">
                                    <BootstrapForm.Label>메모</BootstrapForm.Label>
                                    <BootstrapForm.Control
                                        as="textarea"
                                        rows={3}
                                        name="notes"
                                        value={values.notes}
                                        onChange={handleChange}
                                        isInvalid={touched.notes && errors.notes}
                                    />
                                    <BootstrapForm.Control.Feedback type="invalid">
                                        {errors.notes}
                                    </BootstrapForm.Control.Feedback>
                                </BootstrapForm.Group>

                                <Button variant="primary" type="submit">
                                    저장
                                </Button>
                                <Button variant="secondary" onClick={handleCloseModal}>
                                    취소
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default EmployeeManagementForm;