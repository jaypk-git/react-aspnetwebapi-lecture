```
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using northwind_demo.Server.Models;

namespace Northwind.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly NorthwindContext _context;
        private const int PageSize = 10;

        public EmployeesController(NorthwindContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetEmployees(int page = 1)
        {
            // TODO: 페이징을 적용하여 직원 목록을 반환하는 로직을 구현하세요.
            throw new NotImplementedException();
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchEmployees(string lastName, string firstName, string title, int page = 1)
        {
            // TODO: 주어진 매개변수로 직원을 검색하고 결과를 반환하는 로직을 구현하세요.
            throw new NotImplementedException();
        }

        [HttpPost]
        public async Task<IActionResult> CreateEmployee([FromBody] Employee employee)
        {
            // TODO: 새 직원을 생성하는 로직을 구현하세요.
            throw new NotImplementedException();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] Employee employee)
        {
            // TODO: 기존 직원 정보를 업데이트하는 로직을 구현하세요.
            throw new NotImplementedException();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            // TODO: 직원을 삭제하는 로직을 구현하세요.
            throw new NotImplementedException();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployee(int id)
        {
            // TODO: 특정 ID의 직원을 조회하는 로직을 구현하세요.
            throw new NotImplementedException();
        }

        private bool EmployeeExists(int id)
        {
            // TODO: 직원 ID가 존재하는지 확인하는 로직을 구현하세요.
            throw new NotImplementedException();
        }
    }
}
```
```
import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { Container, Row, Col, Button, Table, Modal, Form as BootstrapForm, Pagination, Card } from 'react-bootstrap';
import * as Yup from 'yup';

import 'bootstrap/dist/css/bootstrap.min.css';

// TODO: API 함수들을 구현하세요 (fetchEmployees, searchEmployees, deleteEmployee, saveEmployee)

// TODO: Validation 스키마를 구현하세요 (employeeSchema)

const EmployeeManagementForm = () => {
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = React.useState(1);
    const [showModal, setShowModal] = React.useState(false);
    const [editingEmployee, setEditingEmployee] = React.useState(null);

    // TODO: react-query hooks를 사용하여 데이터 fetching 및 mutation을 구현하세요

    // TODO: 검색, 삭제, 수정, 추가 핸들러 함수들을 구현하세요

    return (
        <Container className="mt-4">
            <Card>
                <Card.Header as="h5">직원 관리</Card.Header>
                <Card.Body>
                    {/* TODO: 검색 폼을 구현하세요 */}
                    
                    {/* TODO: 직원 목록 테이블을 구현하세요 */}
                    
                    {/* TODO: 페이지네이션을 구현하세요 */}
                </Card.Body>
            </Card>

            {/* TODO: 직원 추가/수정 모달을 구현하세요 */}
        </Container>
    );
};

export default EmployeeManagementForm;
```
