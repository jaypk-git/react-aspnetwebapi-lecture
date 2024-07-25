```
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Northwind.Server.Models;

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
            var query = _context.Employees.AsQueryable();

            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)PageSize);

            var employees = await query
                .Skip((page - 1) * PageSize)
                .Take(PageSize)
                .Select(e => new
                {
                    e.EmployeeId,
                    e.LastName,
                    e.FirstName,
                    e.Title,
                    e.TitleOfCourtesy,
                    e.BirthDate,
                    e.HireDate,
                    e.Address,
                    e.City,
                    e.Region,
                    e.PostalCode,
                    e.Country,
                    e.HomePhone,
                    e.Extension,
                    e.Notes
                })
                .ToListAsync();

            return Ok(new { employees, totalPages });
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchEmployees(string lastName, string firstName, string title, int page = 1)
        {
            var query = _context.Employees.AsQueryable();

            if (!string.IsNullOrEmpty(lastName))
                query = query.Where(e => e.LastName.Contains(lastName));

            if (!string.IsNullOrEmpty(firstName))
                query = query.Where(e => e.FirstName.Contains(firstName));

            if (!string.IsNullOrEmpty(title))
                query = query.Where(e => e.Title.Contains(title));

            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)PageSize);

            var employees = await query
                .Skip((page - 1) * PageSize)
                .Take(PageSize)
                .Select(e => new
                {
                    e.EmployeeId,
                    e.LastName,
                    e.FirstName,
                    e.Title,
                    e.TitleOfCourtesy,
                    e.BirthDate,
                    e.HireDate,
                    e.Address,
                    e.City,
                    e.Region,
                    e.PostalCode,
                    e.Country,
                    e.HomePhone,
                    e.Extension,
                    e.Notes
                })
                .ToListAsync();

            return Ok(new { employees, totalPages });
        }

        [HttpPost]
        public async Task<IActionResult> CreateEmployee([FromBody] Employee employee)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployee), new { id = employee.EmployeeId }, employee);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] Employee employee)
        {
            if (id != employee.EmployeeId)
                return BadRequest();

            _context.Entry(employee).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
                return NotFound();

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);

            if (employee == null)
                return NotFound();

            return Ok(employee);
        }

        private bool EmployeeExists(int id)
        {
            return _context.Employees.Any(e => e.EmployeeId == id);
        }
    }}

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
