namespace MyDietBackend.Models
{
    public class Meal
    {
        // PK
        public int Id { get; set; }

        // FK
        public int MealPlanId { get; set; }
        public int RecipeId { get; set; }

        // Fields
        public int Servings { get; set; }
        public bool IsEaten { get; set; }

        // Navigation
        public MealPlan MealPlan { get; set; }
        public Recipe Recipe { get; set; }
    }
}