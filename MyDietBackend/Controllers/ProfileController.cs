using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyDietBackend.Database;
using MyDietBackend.Models;
using System.Security.Claims;

namespace MyDietBackend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : BaseController
    {
        private readonly DataContext _context;

        public ProfileController(DataContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<Profile>> CreateOrUpdate(Profile profile)
        {
            var userId = GetUserIdFromToken();
            profile.UserId = userId;

            var existingProfile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);

            if (existingProfile == null)
            {
                _context.Profiles.Add(profile);
            }
            else
            {
                existingProfile.CurrentAge = profile.CurrentAge;
                existingProfile.Sex = profile.Sex;
                existingProfile.Weight = profile.Weight;
                existingProfile.Height = profile.Height;
                existingProfile.ActivityFactor = profile.ActivityFactor;
                existingProfile.TargetWeight = profile.TargetWeight;
                existingProfile.ChangePerMonth = profile.ChangePerMonth;
                existingProfile.MealsPerDay = profile.MealsPerDay;
                existingProfile.DailyCalories = profile.DailyCalories;

                _context.Entry(existingProfile).State = EntityState.Modified;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProfileExists(userId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpGet]
        public async Task<ActionResult<Profile>> Get()
        {
            var userId = GetUserIdFromToken();

            var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile == null)
            {
                return NotFound();
            }

            return profile;
        }

        private bool ProfileExists(int userId)
        {
            return _context.Profiles.Any(e => e.UserId == userId);
        }
    }
}