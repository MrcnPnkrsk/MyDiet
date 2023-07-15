namespace MyDietBackend.DTO
{
    public class CreateRecipeDto
    {
        public string Name { get; set; }
        public string Instructions { get; set; }
        public double TotalEnergy { get; set; }
        public double TotalFat { get; set; }
        public double TotalCarbs { get; set; }
        public double TotalProtein { get; set; }
        public IEnumerable<RecipeProductDto> Products { get; set; }
    }
}