using Microsoft.EntityFrameworkCore;
using MyDietBackend.Database;
using MyDietBackend.DTO;
using MyDietBackend.Models;

namespace MyDietBackend.Services
{
    public class MealService : IMealService
    {
        private readonly DataContext _context;

        public MealService(DataContext context)
        {
            _context = context;
        }

        public async Task<MealPlan> AddMeal(int userId, AddMealToMealPlanDto addMealToPlanDto)
        {
            var mealPlan = await _context.MealPlans
                .Include(mp => mp.Meals)
                    .ThenInclude(mpi => mpi.Recipe)
                .FirstOrDefaultAsync(mp => mp.UserId == userId && mp.Date.Date == addMealToPlanDto.MealPlanDate.Date);

            if (mealPlan == null)
                return null;

            var recipe = await _context.Recipes.FindAsync(addMealToPlanDto.RecipeId);
            if (recipe == null)
                throw new Exception("Recipe not found");

            var mealPlanItem = new Meal
            {
                RecipeId = recipe.Id,
                Recipe = recipe,
                MealPlan = mealPlan,
                Servings = addMealToPlanDto.Servings
            };

            mealPlan.Meals.Add(mealPlanItem);

            await _context.SaveChangesAsync();

            return mealPlan;
        }

        public async Task<bool> DeleteMeal(int id)
        {
            var mealPlanItem = await _context.MealPlanItems.FindAsync(id);

            if (mealPlanItem == null)
                return false;

            _context.MealPlanItems.Remove(mealPlanItem);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Meal> SwitchMeal(int mealPlanItemId, bool isEaten)
        {
            var mealPlanItem = await _context.MealPlanItems.FindAsync(mealPlanItemId);
            
            if (mealPlanItem == null)
                return null;
            
            mealPlanItem.IsEaten = isEaten;
            await _context.SaveChangesAsync();

            return mealPlanItem;
        }
    }
}