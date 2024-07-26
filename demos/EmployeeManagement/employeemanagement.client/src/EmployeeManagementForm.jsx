
import React, { useState, useEffect } from 'react';
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
    const url = employee.employeeID ? `/api/employees/${employee.employeeID}` : '/api/employees';
    const method = employee.employeeID ? 'PUT' : 'POST';
    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
};

const fetchAllTerritories = async () => {
    const response = await fetch('/api/employees/territories');
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
};

const fetchEmployeeTerritories = async (employeeId) => {
    const response = await fetch(`/api/employees/${employeeId}/territories`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
};

// Validation schema
const employeeSchema = Yup.object().shape({
    lastName: Yup.string().required('Last name is required'),
    firstName: Yup.string().required('First name is required'),
    title: Yup.string().required('Title is required'),
    titleOfCourtesy: Yup.string(),
    birthDate: Yup.date().nullable(),
    hireDate: Yup.date().nullable(),
    address: Yup.string(),
    city: Yup.string(),
    region: Yup.string(),
    postalCode: Yup.string(),
    country: Yup.string(),
    homePhone: Yup.string(),
    extension: Yup.string(),
    notes: Yup.string(),
    reportsTo: Yup.number().nullable(),
    photoPath: Yup.string(),
    territories: Yup.array().of(
        Yup.object().shape({
            territoryID: Yup.string().required(),
            territoryDescription: Yup.string().required(),
            regionID: Yup.number().required(),
            isSelected: Yup.boolean()
        })
    )
});

const EmployeeManagementForm = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [allTerritories, setAllTerritories] = useState([]);

    const queryClient = useQueryClient();

    const { data: employeesData, isLoading, isError } = useQuery(['employees', currentPage], () => fetchEmployees(currentPage));

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

    useEffect(() => {
        fetchAllTerritories().then(setAllTerritories);
    }, []);

    const handleSearch = (values) => {
        searchMutation.mutate({ ...values, page: currentPage });
    };

    const handleDelete = (employeeId) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            deleteMutation.mutate(employeeId);
        }
    };

    const handleEdit = async (employee) => {
        const territories = await fetchEmployeeTerritories(employee.employeeID);
        setEditingEmployee({ ...employee, territories });
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

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading employees</div>;

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
                                <tr key={employee.employeeID}>
                                    <td>{employee.employeeID}</td>
                                    <td>{`${employee.lastName}, ${employee.firstName}`}</td>
                                    <td>{employee.title}</td>
                                    <td>{new Date(employee.hireDate).toLocaleDateString()}</td>
                                    <td>{employee.city}</td>
                                    <td>{employee.country}</td>
                                    <td>
                                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(employee)}>수정</Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(employee.employeeID)}>삭제</Button>
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
                            notes: '',
                            reportsTo: null,
                            photoPath: '',
                            territories: allTerritories
                        }}
                        validationSchema={employeeSchema}
                        onSubmit={handleSaveEmployee}
                    >
                        {({ handleSubmit, handleChange, values, touched, errors, setFieldValue }) => (
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>성</BootstrapForm.Label>
                                            <Field name="lastName" as={BootstrapForm.Control} isInvalid={touched.lastName && errors.lastName} />
                                            <ErrorMessage name="lastName" component="div" className="text-danger" />
                                        </BootstrapForm.Group>
                                    </Col>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>이름</BootstrapForm.Label>
                                            <Field name="firstName" as={BootstrapForm.Control} isInvalid={touched.firstName && errors.firstName} />
                                            <ErrorMessage name="firstName" component="div" className="text-danger" />
                                        </BootstrapForm.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>직책</BootstrapForm.Label>
                                            <Field name="title" as={BootstrapForm.Control} isInvalid={touched.title && errors.title} />
                                            <ErrorMessage name="title" component="div" className="text-danger" />
                                        </BootstrapForm.Group>
                                    </Col>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>직함</BootstrapForm.Label>
                                            <Field name="titleOfCourtesy" as={BootstrapForm.Control} />
                                        </BootstrapForm.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>생년월일</BootstrapForm.Label>
                                            <Field name="birthDate" type="date" as={BootstrapForm.Control} />
                                        </BootstrapForm.Group>
                                    </Col>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>고용일</BootstrapForm.Label>
                                            <Field name="hireDate" type="date" as={BootstrapForm.Control} />
                                        </BootstrapForm.Group>
                                    </Col>
                                </Row>

                                <BootstrapForm.Group className="mb-3">
                                    <BootstrapForm.Label>주소</BootstrapForm.Label>
                                    <Field name="address" as={BootstrapForm.Control} />
                                </BootstrapForm.Group>

                                <Row>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>도시</BootstrapForm.Label>
                                            <Field name="city" as={BootstrapForm.Control} />
                                        </BootstrapForm.Group>
                                    </Col>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>지역</BootstrapForm.Label>
                                            <Field name="region" as={BootstrapForm.Control} />
                                        </BootstrapForm.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>우편번호</BootstrapForm.Label>
                                            <Field name="postalCode" as={BootstrapForm.Control} />
                                        </BootstrapForm.Group>
                                    </Col>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>국가</BootstrapForm.Label>
                                            <Field name="country" as={BootstrapForm.Control} />
                                        </BootstrapForm.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>전화번호</BootstrapForm.Label>
                                            <Field name="homePhone" as={BootstrapForm.Control} />
                                        </BootstrapForm.Group>
                                    </Col>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>내선 번호</BootstrapForm.Label>
                                            <Field name="extension" as={BootstrapForm.Control} />
                                        </BootstrapForm.Group>
                                    </Col>
                                </Row>

                                <BootstrapForm.Group className="mb-3">
                                    <BootstrapForm.Label>메모</BootstrapForm.Label>
                                    <Field name="notes" as={BootstrapForm.Control} component="textarea" rows={3} />
                                </BootstrapForm.Group>

                                <BootstrapForm.Group className="mb-3">
                                    <BootstrapForm.Label>상급자</BootstrapForm.Label>
                                    <Field name="reportsTo" as={BootstrapForm.Control} type="number" />
                                </BootstrapForm.Group>

                                <BootstrapForm.Group className="mb-3">
                                    <BootstrapForm.Label>사진 경로</BootstrapForm.Label>
                                    <Field name="photoPath" as={BootstrapForm.Control} />
                                </BootstrapForm.Group>

                                <BootstrapForm.Group className="mb-3">
                                    <BootstrapForm.Label>담당 지역</BootstrapForm.Label>
                                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {values.territories.map((territory, index) => (
                                            <BootstrapForm.Check
                                                key={territory.territoryID}
                                                type="checkbox"
                                                id={`territory-${territory.territoryID}`}
                                                label={`${territory.territoryDescription} (Region ${territory.regionID})`}
                                                checked={territory.isSelected}
                                                onChange={(e) => {
                                                    const updatedTerritories = [...values.territories];
                                                    updatedTerritories[index].isSelected = e.target.checked;
                                                    setFieldValue('territories', updatedTerritories);
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <ErrorMessage name="territories" component="div" className="text-danger" />
                                </BootstrapForm.Group>

                                <Button variant="primary" type="submit">
                                    저장
                                </Button>
                                <Button variant="secondary" onClick={handleCloseModal} className="ms-2">
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