using MyDietBackend.Models;

namespace MyDietBackend.Services
{
    public interface IUserService
    {
        Task<User> Login(string username, string password);

        Task<User> Register(User user, string password);

        Task<bool> UserExists(string username);
    }
}