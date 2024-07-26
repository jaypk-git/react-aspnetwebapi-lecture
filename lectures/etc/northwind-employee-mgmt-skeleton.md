

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

```
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourNamespace.Server.Models;
using System.Linq;

namespace YourNamespace.Server.Controllers
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

        // ... (기존 메서드들 유지)

        [HttpGet("territories")]
        public async Task<IActionResult> GetTerritories()
        {
            var territories = await _context.Territories
                .Select(t => new { t.TerritoryID, t.TerritoryDescription })
                .ToListAsync();

            return Ok(territories);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployee(int id)
        {
            var employee = await _context.Employees
                .Include(e => e.EmployeeTerritories)
                .ThenInclude(et => et.Territory)
                .Where(e => e.EmployeeID == id)
                .Select(e => new
                {
                    e.EmployeeID,
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
                    e.Notes,
                    Territories = e.EmployeeTerritories.Select(et => et.TerritoryID).ToList()
                })
                .FirstOrDefaultAsync();

            if (employee == null)
                return NotFound();

            return Ok(employee);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEmployee([FromBody] EmployeeViewModel employeeVM)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var employee = new Employee
            {
                // Map properties from ViewModel to Entity
                LastName = employeeVM.LastName,
                FirstName = employeeVM.FirstName,
                // ... (map other properties)
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            // Add territories
            if (employeeVM.Territories != null)
            {
                foreach (var territoryId in employeeVM.Territories)
                {
                    _context.EmployeeTerritories.Add(new EmployeeTerritory
                    {
                        EmployeeID = employee.EmployeeID,
                        TerritoryID = territoryId
                    });
                }
                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetEmployee), new { id = employee.EmployeeID }, employee);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] EmployeeViewModel employeeVM)
        {
            if (id != employeeVM.EmployeeID)
                return BadRequest();

            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
                return NotFound();

            // Update employee properties
            employee.LastName = employeeVM.LastName;
            employee.FirstName = employeeVM.FirstName;
            // ... (update other properties)

            // Update territories
            var currentTerritories = await _context.EmployeeTerritories
                .Where(et => et.EmployeeID == id)
                .ToListAsync();

            // Remove territories that are not in the updated list
            foreach (var territory in currentTerritories)
            {
                if (!employeeVM.Territories.Contains(territory.TerritoryID))
                {
                    _context.EmployeeTerritories.Remove(territory);
                }
            }

            // Add new territories
            foreach (var territoryId in employeeVM.Territories)
            {
                if (!currentTerritories.Any(t => t.TerritoryID == territoryId))
                {
                    _context.EmployeeTerritories.Add(new EmployeeTerritory
                    {
                        EmployeeID = id,
                        TerritoryID = territoryId
                    });
                }
            }

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

        // ... (기존 메서드들 유지)
    }

    public class EmployeeViewModel
    {
        public int EmployeeID { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        // ... (다른 Employee 속성들)
        public List<string> Territories { get; set; }
    }
}
```
