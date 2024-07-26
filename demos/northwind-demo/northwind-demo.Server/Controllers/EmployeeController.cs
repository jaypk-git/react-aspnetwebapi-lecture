using Microsoft.AspNetCore.Http;
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
            var query = _context.Employees.AsQueryable();

            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)PageSize);

            var employees = await query
                .Skip((page - 1) * PageSize)
                .Take(PageSize)
                .Select(e => new EmployeeDTO
                {
                    EmployeeID = e.EmployeeId,
                    LastName = e.LastName,
                    FirstName = e.FirstName,
                    Title = e.Title,
                    TitleOfCourtesy = e.TitleOfCourtesy,
                    BirthDate = e.BirthDate,
                    HireDate = e.HireDate,
                    Address = e.Address,
                    City = e.City,
                    Region = e.Region,
                    PostalCode = e.PostalCode,
                    Country = e.Country,
                    HomePhone = e.HomePhone,
                    Extension = e.Extension,
                    Notes = e.Notes,
                    ReportsTo = e.ReportsTo,
                    PhotoPath = e.PhotoPath
                })
                .ToListAsync();

            return Ok(new { employees, totalPages });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployee(int id)
        {
            var employee = await _context.Employees
                .Where(e => e.EmployeeId == id)
                .Select(e => new EmployeeDTO
                {
                    EmployeeID = e.EmployeeId,
                    LastName = e.LastName,
                    FirstName = e.FirstName,
                    Title = e.Title,
                    TitleOfCourtesy = e.TitleOfCourtesy,
                    BirthDate = e.BirthDate,
                    HireDate = e.HireDate,
                    Address = e.Address,
                    City = e.City,
                    Region = e.Region,
                    PostalCode = e.PostalCode,
                    Country = e.Country,
                    HomePhone = e.HomePhone,
                    Extension = e.Extension,
                    Notes = e.Notes,
                    ReportsTo = e.ReportsTo,
                    PhotoPath = e.PhotoPath
                })
                .FirstOrDefaultAsync();

            if (employee == null)
                return NotFound();

            return Ok(employee);
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
                .Select(e => new EmployeeDTO
                {
                    EmployeeID = e.EmployeeId,
                    LastName = e.LastName,
                    FirstName = e.FirstName,
                    Title = e.Title,
                    TitleOfCourtesy = e.TitleOfCourtesy,
                    BirthDate = e.BirthDate,
                    HireDate = e.HireDate,
                    Address = e.Address,
                    City = e.City,
                    Region = e.Region,
                    PostalCode = e.PostalCode,
                    Country = e.Country,
                    HomePhone = e.HomePhone,
                    Extension = e.Extension,
                    Notes = e.Notes,
                    ReportsTo = e.ReportsTo,
                    PhotoPath = e.PhotoPath
                })
                .ToListAsync();

            return Ok(new { employees, totalPages });
        }

        [HttpPost]
        public async Task<IActionResult> CreateEmployee([FromBody] EmployeeDTO employeeDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var employee = new Employee
            {
                LastName = employeeDTO.LastName,
                FirstName = employeeDTO.FirstName,
                Title = employeeDTO.Title,
                TitleOfCourtesy = employeeDTO.TitleOfCourtesy,
                BirthDate = employeeDTO.BirthDate,
                HireDate = employeeDTO.HireDate,
                Address = employeeDTO.Address,
                City = employeeDTO.City,
                Region = employeeDTO.Region,
                PostalCode = employeeDTO.PostalCode,
                Country = employeeDTO.Country,
                HomePhone = employeeDTO.HomePhone,
                Extension = employeeDTO.Extension,
                Notes = employeeDTO.Notes,
                ReportsTo = employeeDTO.ReportsTo,
                PhotoPath = employeeDTO.PhotoPath
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            // Add selected territories
            if (employeeDTO.Territories != null)
            {
                foreach (var territory in employeeDTO.Territories.Where(t => t.IsSelected))
                {
                    _context.EmployeeTerritories.Add(new EmployeeTerritory
                    {
                        EmployeeId = employee.EmployeeId,
                        TerritoryId = territory.TerritoryID
                    });
                }
                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetEmployee), new { id = employee.EmployeeId }, employee);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] EmployeeDTO employeeDTO)
        {
            if (id != employeeDTO.EmployeeID)
                return BadRequest();

            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
                return NotFound();

            employee.LastName = employeeDTO.LastName;
            employee.FirstName = employeeDTO.FirstName;
            employee.Title = employeeDTO.Title;
            employee.TitleOfCourtesy = employeeDTO.TitleOfCourtesy;
            employee.BirthDate = employeeDTO.BirthDate;
            employee.HireDate = employeeDTO.HireDate;
            employee.Address = employeeDTO.Address;
            employee.City = employeeDTO.City;
            employee.Region = employeeDTO.Region;
            employee.PostalCode = employeeDTO.PostalCode;
            employee.Country = employeeDTO.Country;
            employee.HomePhone = employeeDTO.HomePhone;
            employee.Extension = employeeDTO.Extension;
            employee.Notes = employeeDTO.Notes;
            employee.ReportsTo = employeeDTO.ReportsTo;
            employee.PhotoPath = employeeDTO.PhotoPath;

            // Update territories
            var currentTerritories = await _context.EmployeeTerritories
                .Where(et => et.EmployeeId == id)
                .ToListAsync();

            // Remove territories that are not selected
            foreach (var territory in currentTerritories)
            {
                if (!employeeDTO.Territories.Any(t => t.TerritoryID == territory.TerritoryId && t.IsSelected))
                {
                    _context.EmployeeTerritories.Remove(territory);
                }
            }

            // Add newly selected territories
            foreach (var territory in employeeDTO.Territories.Where(t => t.IsSelected))
            {
                if (!currentTerritories.Any(t => t.TerritoryId == territory.TerritoryID))
                {
                    _context.EmployeeTerritories.Add(new EmployeeTerritory
                    {
                        EmployeeId = id,
                        TerritoryId = territory.TerritoryID
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

        [HttpGet("territories")]
        public async Task<IActionResult> GetAllTerritories()
        {
            var territories = await _context.Territories
                .Select(t => new TerritoryDTO
                {
                    TerritoryID = t.TerritoryId,
                    TerritoryDescription = t.TerritoryDescription,
                    RegionID = t.RegionId,
                    IsSelected = false
                })
                .ToListAsync();

            return Ok(territories);
        }

        [HttpGet("{id}/territories")]
        public async Task<IActionResult> GetEmployeeTerritories(int id)
        {
            var employeeTerritories = await _context.EmployeeTerritories
                .Where(et => et.EmployeeId == id)
                .Select(et => et.TerritoryId)
                .ToListAsync();

            var allTerritories = await _context.Territories
                .Select(t => new TerritoryDTO
                {
                    TerritoryID = t.TerritoryId,
                    TerritoryDescription = t.TerritoryDescription,
                    RegionID = t.RegionId,
                    IsSelected = employeeTerritories.Contains(t.TerritoryId)
                })
                .ToListAsync();

            return Ok(allTerritories);
        }

        private bool EmployeeExists(int id)
        {
            return _context.Employees.Any(e => e.EmployeeId == id);
        }
    }
}
