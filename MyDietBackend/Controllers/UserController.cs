using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MyDietBackend.DTO;
using MyDietBackend.Models;
using MyDietBackend.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MyDietBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : BaseController
    {
        private readonly IConfiguration _configuration;
        private readonly IUserService _userService;
        public UserController(IUserService userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserRequestDto userRequestDto)
        {
            var userFromService = await _userService.Login(userRequestDto.Username, userRequestDto.Password);

            if (userFromService == null)
                return Unauthorized();

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration.GetSection("Secret").Value);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                new Claim(ClaimTypes.NameIdentifier, userFromService.Id.ToString()),
                new Claim(ClaimTypes.Name, userFromService.Username),
                new Claim(ClaimTypes.Role, userFromService.Role.ToString()),
                }),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new { tokenString });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRequestDto userRequestDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (await _userService.UserExists(userRequestDto.Username))
                return BadRequest("Username is already taken");

            var userToCreate = new User
            {
                Username = userRequestDto.Username,
                Role = UserRole.User
            };

            var createdUser = await _userService.Register(userToCreate, userRequestDto.Password);

            return StatusCode(201);
        }
    }
}