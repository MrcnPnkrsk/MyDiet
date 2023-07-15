namespace MyDietBackend.DTO
{
    public class AddMealToMealPlanDto
    {
        public DateTime MealPlanDate { get; set; }
        public int RecipeId { get; set; }
        public int Servings { get; set; }
    }
}