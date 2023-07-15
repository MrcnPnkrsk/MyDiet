namespace MyDietBackend.Models
{
    public class Product
    {
        // PK
        public int Id { get; set; }

        // FK
        public double Carbs { get; set; }
        public string Category { get; set; }
        public double Energy { get; set; }
        public double Fat { get; set; }
        public string Name { get; set; }
        public double Protein { get; set; }
        public string Url { get; set; }

        // Fields

        // Navigation
        public ICollection<RecipeProduct> RecipeProducts { get; set; }
    }
}