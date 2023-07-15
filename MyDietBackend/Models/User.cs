namespace MyDietBackend.Models
{
    public class User
    {
        // PK
        public int Id { get; set; }

        // FK

        // Fields
        public string Username { get; set; }
        public UserRole Role { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }

        // Navigation
        public Profile Profile { get; set; }
    }

    public enum UserRole
    {
        User,
        Administrator
    }
}