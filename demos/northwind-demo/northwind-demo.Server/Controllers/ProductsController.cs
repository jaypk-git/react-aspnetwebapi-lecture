using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using northwind_demo.Server.Models;

namespace Northwind.Server.Controllers
{
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
}
