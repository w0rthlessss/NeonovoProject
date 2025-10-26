using Microsoft.AspNetCore.Mvc;
using System.IO;

public class RouteController : Controller
{
    private readonly IWebHostEnvironment _env;

    public RouteController(IWebHostEnvironment env)
    {
        _env = env;
    }

    [HttpGet("/")]
    public IActionResult Index()
    {
        var filePath = Path.Combine(_env.WebRootPath, "index.html");
        return PhysicalFile(filePath, "text/html");
    }

    [HttpGet("/auth")]
    public IActionResult Auth()
    {
        var filePath = Path.Combine(_env.ContentRootPath, "AdminPanel", "auth.html");
        return PhysicalFile(filePath, "text/html");
    }

    [HttpGet("/admin")]
    public IActionResult Admin()
    {
        var isAuthenticated = HttpContext.Session.GetString("IsAuthenticated") == "true";
        if (!isAuthenticated)
        {
            return Redirect("/auth");
        }

        var filePath = Path.Combine(_env.ContentRootPath, "AdminPanel", "admin.html");
        return PhysicalFile(filePath, "text/html");
    }
}