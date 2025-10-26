using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ImageModelController : ControllerBase
{
    private readonly AppDbContext Context;

    public ImageModelController(AppDbContext context){
        this.Context = context;
    }

    
    [HttpGet]
    public async Task<IActionResult> GetImages()
    {
        var images = await Context.ImageModels.Select(img => new {
            img.Id, 
            img.ImageType,
            img.Name, 
            img.Description, 
            img.Destination, 
            imgData = Convert.ToBase64String(img.ImageData)
        }).ToListAsync();

        return Ok(images);
    }
}