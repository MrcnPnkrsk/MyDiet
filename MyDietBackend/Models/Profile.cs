using System.Text.Json.Serialization;

namespace MyDietBackend.Models
{
    public class Profile
    {
        // PK
        [JsonIgnore]
        public int Id { get; set; } // Primary key

        // FK
        [JsonIgnore]
        public int UserId { get; set; } // Foreign key

        // Fields

        // Navigation
        public double ActivityFactor { get; set; }
        public double ChangePerMonth { get; set; }
        public int CurrentAge { get; set; }
        public double DailyCalories { get; set; }
        public double Height { get; set; }
        public double MealsPerDay { get; set; }
        public string Sex { get; set; }
        public double TargetWeight { get; set; }
        public double Weight { get; set; }
    }
}