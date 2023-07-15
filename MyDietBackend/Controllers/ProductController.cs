using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyDietBackend.Database;
using MyDietBackend.DTO;
using MyDietBackend.Models;

namespace MyDietBackend.Controllers
{
    [Authorize(Roles = "Administrator")] // restrict this API controller to admin users only
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : BaseController
    {
        private readonly DataContext _context;

        public ProductController(DataContext context)
        {
            _context = context;
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Product>> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return product;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(CreateProductDto productDto)
        {
            var product = new Product
            {
                Name = productDto.Name,
                Category = productDto.Category,
                Energy = productDto.Energy,
                Fat = productDto.Fat,
                Carbs = productDto.Carbs,
                Protein = productDto.Protein,
                Url = productDto.Url
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Product>> PutProduct(int id, CreateProductDto productDto)
        {
            var product = new Product
            {
                Id = id,
                Name = productDto.Name,
                Category = productDto.Category,
                Energy = productDto.Energy,
                Fat = productDto.Fat,
                Carbs = productDto.Carbs,
                Protein = productDto.Protein,
                Url = productDto.Url
            };

            _context.Entry(product).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return product;
        }
    }
}