using MyDietBackend.DTO;
using MyDietBackend.Models;

namespace MyDietBackend.Services
{
    public interface IMealService
    {
        Task<MealPlan> AddMeal(int userId, AddMealToMealPlanDto addMealToPlanDto);

        Task<bool> DeleteMeal(int id);

        Task<Meal> SwitchMeal(int mealPlanItemId, bool isEaten);
    }
}