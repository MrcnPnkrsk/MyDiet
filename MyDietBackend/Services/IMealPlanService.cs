using MyDietBackend.Models;

namespace MyDietBackend.Services
{
    public interface IMealPlanService
    {
        Task<IEnumerable<MealPlan>> Generate(int userId, DateTime startDate, DateTime endDate);

        Task<IEnumerable<MealPlan>> Get(int userId);
    }
}