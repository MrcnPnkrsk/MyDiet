using Microsoft.EntityFrameworkCore;
using MyDietBackend.Database;
using MyDietBackend.Models;

namespace MyDietBackend.Services
{
    public class MealPlanService : IMealPlanService
    {
        private readonly DataContext _context;

        public MealPlanService(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MealPlan>> Generate(int userId, DateTime startDate, DateTime endDate)
        {
            var profile = await _context.Profiles.FindAsync(userId);

            var dailyCalories = profile.DailyCalories;
            var mealsPerDay = profile.MealsPerDay;

            var recipes = await _context.Recipes
                .Where(r => r.TotalEnergy <= dailyCalories / mealsPerDay)
                .ToListAsync();

            if (!recipes.Any())
                return null;

            var random = new Random();
            var mealPlans = new List<MealPlan>();

            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                var existingMealPlan = await _context.MealPlans.FirstOrDefaultAsync(mp => mp.Date.Date == date.Date && mp.UserId == userId);

                if (existingMealPlan != null)
                {
                    _context.MealPlans.Remove(existingMealPlan);
                    await _context.SaveChangesAsync();
                }

                var mealPlan = new MealPlan
                {
                    UserId = userId,
                    Date = date,
                    Meals = new List<Meal>()
                };

                var caloriesForTheDay = 0.0;
                for (var meal = 0; meal < mealsPerDay; meal++)
                {
                    var remainingMeals = mealsPerDay - meal;
                    var avgCaloriesPerRemainingMeal = (dailyCalories - caloriesForTheDay) / remainingMeals;

                    var recipe = recipes[random.Next(recipes.Count)];
                    var maxServings = (int)(avgCaloriesPerRemainingMeal / recipe.TotalEnergy);
                    var servings = Math.Max(1, maxServings);

                    var caloriesForThisMeal = servings * recipe.TotalEnergy;

                    if (caloriesForTheDay + caloriesForThisMeal > dailyCalories && servings > 1)
                    {
                        servings--;
                        caloriesForThisMeal = servings * recipe.TotalEnergy;
                    }

                    mealPlan.Meals.Add(new Meal
                    {
                        RecipeId = recipe.Id,
                        MealPlan = mealPlan,
                        Servings = servings
                    });

                    caloriesForTheDay += caloriesForThisMeal;
                }

                mealPlans.Add(mealPlan);
            }

            _context.MealPlans.AddRange(mealPlans);
            await _context.SaveChangesAsync();

            return mealPlans;
        }

        public async Task<IEnumerable<MealPlan>> Get(int userId)
        {
            return await _context.MealPlans
                .Include(mp => mp.Meals)
                    .ThenInclude(mpi => mpi.Recipe)
                        .ThenInclude(r => r.RecipeProducts)
                            .ThenInclude(rp => rp.Product)
                .Where(mp => mp.UserId == userId)
                .ToListAsync();
        }
    }
}