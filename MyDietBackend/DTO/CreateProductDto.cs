namespace MyDietBackend.DTO
{
    public class CreateProductDto
    {
        public string Name { get; set; }
        public string Category { get; set; }
        public double Energy { get; set; }
        public double Fat { get; set; }
        public double Carbs { get; set; }
        public double Protein { get; set; }
        public string Url { get; set; }
    }
}