namespace MyDietBackend.Models
{
    public class Recipe
    {
        // PK
        public int Id { get; set; }

        // FK

        // Fields
        public string Instructions { get; set; }
        public string Name { get; set; }
        public double TotalCarbs { get; set; }
        public double TotalEnergy { get; set; }
        public double TotalFat { get; set; }
        public double TotalProtein { get; set; }

        // Navigation
        public ICollection<RecipeProduct> RecipeProducts { get; set; }
    }
}