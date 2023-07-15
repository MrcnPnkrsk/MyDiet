using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyDietBackend.Database;
using MyDietBackend.DTO;
using MyDietBackend.Models;
using System.Data;

namespace MyDietBackend.Controllers
{
    [Authorize(Roles = "Administrator")]
    [Route("api/[controller]")]
    [ApiController]
    public class RecipeController : BaseController
    {
        private readonly DataContext _context;

        public RecipeController(DataContext context)
        {
            _context = context;
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            var recipe = await _context.Recipes.FindAsync(id);
            if (recipe == null)
            {
                return NotFound();
            }

            _context.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GetRecipeDto>> GetRecipe(int id)
        {
            var recipe = await _context.Recipes
                .Include(r => r.RecipeProducts)
                    .ThenInclude(rp => rp.Product)
                .Select(r => new GetRecipeDto
                {
                    Id = r.Id,
                    Name = r.Name,
                    Instructions = r.Instructions,
                    TotalEnergy = r.TotalEnergy,
                    TotalFat = r.TotalFat,
                    TotalCarbs = r.TotalCarbs,
                    TotalProtein = r.TotalProtein,
                    Products = r.RecipeProducts.Select(rp => new RecipeProductDto
                    {
                        ProductId = rp.ProductId,
                        Amount = rp.Amount
                    }).ToList()
                }).FirstOrDefaultAsync(r => r.Id == id);

            if (recipe == null)
            {
                return NotFound();
            }

            return recipe;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetRecipeDto>>> GetRecipes()
        {
            return await _context.Recipes
                .Include(r => r.RecipeProducts)
                    .ThenInclude(rp => rp.Product)
                .Select(r => new GetRecipeDto
                {
                    Id = r.Id,
                    Name = r.Name,
                    Instructions = r.Instructions,
                    TotalEnergy = r.TotalEnergy,
                    TotalFat = r.TotalFat,
                    TotalCarbs = r.TotalCarbs,
                    TotalProtein = r.TotalProtein,
                    Products = r.RecipeProducts.Select(rp => new RecipeProductDto
                    {
                        ProductId = rp.ProductId,
                        Amount = rp.Amount
                    }).ToList()
                }).ToListAsync();
        }
        [HttpPost]
        public async Task<ActionResult<GetRecipeDto>> PostRecipe(CreateRecipeDto recipeDto)
        {
            var recipe = new Recipe
            {
                Name = recipeDto.Name,
                Instructions = recipeDto.Instructions,
                TotalEnergy = recipeDto.TotalEnergy,
                TotalFat = recipeDto.TotalFat,
                TotalCarbs = recipeDto.TotalCarbs,
                TotalProtein = recipeDto.TotalProtein,
                RecipeProducts = recipeDto.Products.Select(p => new RecipeProduct
                {
                    ProductId = p.ProductId,
                    Amount = p.Amount
                }).ToList()
            };

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            var recipeReturnDto = new GetRecipeDto
            {
                Id = recipe.Id,
                Name = recipe.Name,
                Instructions = recipe.Instructions,
                TotalEnergy = recipe.TotalEnergy,
                TotalFat = recipe.TotalFat,
                TotalCarbs = recipe.TotalCarbs,
                TotalProtein = recipe.TotalProtein,
                Products = recipe.RecipeProducts.Select(rp => new RecipeProductDto
                {
                    ProductId = rp.ProductId,
                    Amount = rp.Amount
                }).ToList()
            };

            return CreatedAtAction("GetRecipe", new { id = recipe.Id }, recipeReturnDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<GetRecipeDto>> PutRecipe(int id, CreateRecipeDto recipeDto)
        {
            var recipe = await _context.Recipes.Include(r => r.RecipeProducts)
                                               .ThenInclude(rp => rp.Product)
                                               .FirstOrDefaultAsync(r => r.Id == id);

            if (recipe == null)
            {
                return NotFound();
            }

            recipe.Name = recipeDto.Name;
            recipe.Instructions = recipeDto.Instructions;
            recipe.TotalEnergy = recipeDto.TotalEnergy;
            recipe.TotalFat = recipeDto.TotalFat;
            recipe.TotalCarbs = recipeDto.TotalCarbs;
            recipe.TotalProtein = recipeDto.TotalProtein;
            recipe.RecipeProducts = recipeDto.Products.Select(p => new RecipeProduct
            {
                ProductId = p.ProductId,
                Amount = p.Amount
            }).ToList();

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RecipeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            var recipeReturnDto = new GetRecipeDto
            {
                Id = recipe.Id,
                Name = recipe.Name,
                Instructions = recipe.Instructions,
                TotalEnergy = recipe.TotalEnergy,
                TotalFat = recipe.TotalFat,
                TotalCarbs = recipe.TotalCarbs,
                TotalProtein = recipe.TotalProtein,
                Products = recipe.RecipeProducts.Select(rp => new RecipeProductDto
                {
                    ProductId = rp.ProductId,
                    Amount = rp.Amount
                }).ToList()
            };

            return recipeReturnDto;
        }
        private bool RecipeExists(int id)
        {
            return _context.Recipes.Any(e => e.Id == id);
        }
    }
}