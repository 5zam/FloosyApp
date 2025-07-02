using Floosy_Platform_Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Floosy_Platform_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IConfiguration _configuration;

        public AuthController(UserManager<AppUser> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        // ✅ Register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new AuthResponse 
                    { 
                        Success = false, 
                        Message = "Invalid data provided",
                        Errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()
                    });

                // Check if user already exists
                var existingUser = await _userManager.FindByEmailAsync(model.Email);
                if (existingUser != null)
                    return BadRequest(new AuthResponse 
                    { 
                        Success = false, 
                        Message = "User with this email already exists" 
                    });

                var user = new AppUser
                {
                    UserName = model.Email,
                    Email = model.Email,
                    FullName = model.FullName
                };

                var result = await _userManager.CreateAsync(user, model.Password);

                if (!result.Succeeded)
                    return BadRequest(new AuthResponse 
                    { 
                        Success = false, 
                        Message = "User registration failed",
                        Errors = result.Errors.Select(e => e.Description).ToList()
                    });

                return Ok(new AuthResponse 
                { 
                    Success = true, 
                    Message = "User registered successfully" 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new AuthResponse 
                { 
                    Success = false, 
                    Message = "An error occurred during registration" 
                });
            }
        }

        // ✅ Login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new AuthResponse 
                    { 
                        Success = false, 
                        Message = "Invalid data provided" 
                    });

                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
                    return Unauthorized(new AuthResponse 
                    { 
                        Success = false, 
                        Message = "Invalid email or password" 
                    });

                var token = GenerateJwtToken(user);
                return Ok(new AuthResponse 
                { 
                    Success = true, 
                    Token = token, 
                    Message = "Login successful",
                    User = new UserResponse
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FullName = user.FullName,
                        UserName = user.UserName
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new AuthResponse 
                { 
                    Success = false, 
                    Message = "An error occurred during login" 
                });
            }
        }

        // ✅ JWT Token Generation
        private string GenerateJwtToken(AppUser user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName ?? user.Email),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim("FullName", user.FullName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, user.Id)
            };

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(jwtSettings["DurationInMinutes"])),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // ✅ Get Current User
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new AuthResponse 
                    { 
                        Success = false, 
                        Message = "User not authenticated" 
                    });

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                    return NotFound(new AuthResponse 
                    { 
                        Success = false, 
                        Message = "User not found" 
                    });

                return Ok(new AuthResponse 
                { 
                    Success = true, 
                    User = new UserResponse
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FullName = user.FullName,
                        UserName = user.UserName
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new AuthResponse 
                { 
                    Success = false, 
                    Message = "An error occurred while fetching user data" 
                });
            }
        }
    }

    // ✅ Enhanced DTO Models
    public class RegisterModel
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginModel
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponse
    {
        public bool Success { get; set; }
        public string? Token { get; set; }
        public string? Message { get; set; }
        public UserResponse? User { get; set; }
        public List<string>? Errors { get; set; }
    }

    public class UserResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
    }
}