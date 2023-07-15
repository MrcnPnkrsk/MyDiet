using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MyDietBackend.Controllers
{
    public class BaseController : ControllerBase
    {
        protected int GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return int.Parse(userIdClaim.Value);
        }
    }
}
