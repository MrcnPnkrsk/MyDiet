using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyDietBackend.DTO;
using MyDietBackend.Models;
using MyDietBackend.Services;
using System.Security.Claims;

namespace MyDietBackend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MealPlanController : BaseController
    {
        private readonly IMealPlanService _mealPlanService;
        private readonly IMealService _mealService;

        public MealPlanController(IMealPlanService mealPlanService, IMealService mealService)
        {
            _mealPlanService = mealPlanService;
            _mealService = mealService;
        }

        [HttpPost("addMeal")]
        public async Task<ActionResult<MealPlan>> AddMealToPlan([FromBody] AddMealToMealPlanDto addMealToPlanDto)
        {
            var userId = GetUserIdFromToken();

            var mealPlan = await _mealService.AddMeal(userId, addMealToPlanDto);

            if (mealPlan == null)
            {
                return BadRequest("Failed to add meal to plan");
            }

            return Ok(mealPlan);
        }

        [HttpDelete("deleteMeal/{id}")]
        public async Task<ActionResult> DeleteMealPlanItem(int id)
        {
            var result = await _mealService.DeleteMeal(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<MealPlan>> GenerateMealPlan([FromBody] GenerateMealPlanDto generateMealPlanDto)
        {
            var userId = GetUserIdFromToken();

            var mealPlan = await _mealPlanService.Generate(userId, generateMealPlanDto.StartDate, generateMealPlanDto.EndDate);

            if (mealPlan == null)
            {
                return BadRequest("Failed to generate meal plan");
            }

            return Ok(mealPlan);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MealPlan>>> GetMealPlans()
        {
            var userId = GetUserIdFromToken();
            var mealPlans = await _mealPlanService.Get(userId);
            return Ok(mealPlans);
        }

        [HttpPatch("switchMeal/{id}")]
        public async Task<ActionResult> PatchMealPlanItem(int id, [FromBody] bool isEaten)
        {
            try
            {
                var mealPlanItem = await _mealService.SwitchMeal(id, isEaten);
                if (mealPlanItem == null)
                {
                    return NotFound();
                }
                return Ok(mealPlanItem);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}