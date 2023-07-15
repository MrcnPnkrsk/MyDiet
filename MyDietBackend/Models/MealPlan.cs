namespace MyDietBackend.Models
{
    public class MealPlan
    {
        // PK
        public int Id { get; set; }
        
        // FK
        public int UserId { get; set; }

        // Fields
        public DateTime Date { get; set; }

        // Navigation
        public ICollection<Meal> Meals { get; set; }
    }
}