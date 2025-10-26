using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly string adminLogin;
    private readonly string adminPassword;

    public AuthController(IConfiguration config)
    {
        adminLogin = config["AuthData:Login"]!;
        adminPassword = config["AuthData:Password"]!;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        if (request.Email == adminLogin && PasswordHasher.ComputeSha256Hash(request.Password) == adminPassword)
        {
            HttpContext.Session.SetString("IsAuthenticated", "true");
            return Ok(new { message = "Вход успешен!" });
        }

        return Unauthorized(new { message = "Неверный логин или пароль!" });
    }

    [HttpGet("check")]
    public IActionResult CheckAuth()
    {
        var auth = HttpContext.Session.GetString("IsAuthenticated");
        return Ok(new { isAuthenticated = (auth == "true") });
    }
}