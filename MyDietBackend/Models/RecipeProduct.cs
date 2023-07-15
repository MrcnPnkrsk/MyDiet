namespace MyDietBackend.Models
{
    public class RecipeProduct
    {
        //PK
        public int Id { get; set; }

        //FK
        public int ProductId { get; set; }
        public int RecipeId { get; set; }

        //Fields
        public double Amount { get; set; }

        //Navigation
        public Product Product { get; set; }
        public Recipe Recipe { get; set; }
    }
}