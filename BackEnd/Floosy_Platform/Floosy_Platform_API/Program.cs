using Floosy_Platform_BLL.Interfaces;
using Floosy_Platform_BLL.Repositories;
using Floosy_Platform_DAL.Context;
using Floosy_Platform_Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Floosy_Platform_API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add DbContext with retry policy
            builder.Services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
                    sqlOptions =>
                    {
                        sqlOptions.EnableRetryOnFailure(
                            maxRetryCount: 3,
                            maxRetryDelay: TimeSpan.FromSeconds(10),
                            errorNumbersToAdd: null);
                    });
            });

            // Add Identity
            builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
            {
                // Simplified password settings for development
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 6;
                options.Password.RequiredUniqueChars = 1;

                // User settings
                options.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders();

            // Add Generic Repository
            builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

            // JWT Authentication Configuration
            var jwtSettings = builder.Configuration.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ClockSkew = TimeSpan.Zero
                };
            });

            // Enhanced CORS Configuration
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAngularApp", policy =>
                {
                    policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials()
                          .SetIsOriginAllowed(origin => true);
                });
            });

            // Add Controllers and Swagger
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Build the app
            var app = builder.Build();

            // Configure the HTTP request pipeline
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Floosy API V1");
                    c.RoutePrefix = "swagger"; // Set Swagger UI at /swagger
                });
                app.UseDeveloperExceptionPage();
            }

            // Important: CORS must be before Authentication/Authorization
            app.UseCors("AllowAngularApp");

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            // Add default route
            app.MapGet("/", () => "Floosy API is running! Go to /swagger to see the API documentation.");

            // Map controllers
            app.MapControllers();

            // AUTO CREATE DATABASE AND APPLY MIGRATIONS
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<AppDbContext>();
                    var userManager = services.GetRequiredService<UserManager<AppUser>>();
                    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

                    // Create database if it doesn't exist
                    context.Database.EnsureCreated();

                    // Apply any pending migrations
                    if (context.Database.GetPendingMigrations().Any())
                    {
                        context.Database.Migrate();
                    }

                    Console.WriteLine("✅ Database created/updated successfully!");

                    // Seed default user (optional)
                    SeedDefaultUser(userManager, roleManager).Wait();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"❌ Database error: {ex.Message}");
                }
            }

            Console.WriteLine("🚀 Floosy API is running!");
            Console.WriteLine($"📊 Swagger UI: http://localhost:5004/swagger");
            Console.WriteLine($"🌐 API Base URL: http://localhost:5004");

            app.Run();
        }

        private static async Task SeedDefaultUser(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            try
            {
                // Create default user if none exists
                if (!userManager.Users.Any())
                {
                    var defaultUser = new AppUser
                    {
                        UserName = "admin@flossy.om",
                        Email = "admin@flossy.om",
                        FullName = "System Administrator",
                        EmailConfirmed = true
                    };

                    var result = await userManager.CreateAsync(defaultUser, "Admin123!");
                    if (result.Succeeded)
                    {
                        Console.WriteLine("✅ Default user created: admin@flossy.om / Admin123!");
                    }
                    else
                    {
                        Console.WriteLine($"❌ Failed to create default user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error seeding default user: {ex.Message}");
            }
        }
    }
}