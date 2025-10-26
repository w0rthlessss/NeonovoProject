using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class AdminPanelController : ControllerBase
{
    private readonly AppDbContext Context;

    public AdminPanelController(AppDbContext context)
    {
        Context = context;
    }
    #region Image
    [HttpGet("getImages")]
    public async Task<IActionResult> GetImages()
    {
        try 
        {
            var images = await Context.ImageModels.Select(img => new
            {
                img.Id,
                img.ImageType,
                img.Name,
                img.Description,
                img.Destination,
                imgData = Convert.ToBase64String(img.ImageData)
            }).ToListAsync();

            return Ok(images);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("uploadImage")]
    public async Task<IActionResult> UploadImage([FromForm] IFormFile file, [FromForm] string imageType, [FromForm] string name, [FromForm] string description, [FromForm] string destination)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream);

        var newImage = new ImageModel
        {
            ImageData = memoryStream.ToArray(),
            ImageType = imageType,
            Name = name,
            Description = description,
            Destination = destination
        };

        Context.ImageModels.Add(newImage);
        await Context.SaveChangesAsync();

        return Ok(new { success = true});
    }
    
    [HttpPut("updateImage/{id}")]
    public async Task<IActionResult> UpdateImage(int id, [FromForm] IFormFile? file, [FromForm] string imageType, [FromForm] string name, [FromForm] string description, [FromForm] string destination)
    {
        var image = await Context.ImageModels.FindAsync(id);
        if (image == null) return NotFound();

        image.Name = name;
        image.Description = description;
        image.Destination = destination;
        image.ImageType = imageType;

        if (file != null && file.Length > 0)
        {
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            image.ImageData = memoryStream.ToArray();
            image.ImageType = imageType;
        }

        await Context.SaveChangesAsync();
        return Ok(new { success = true });
    }
    

    [HttpDelete("deleteImage/{id}")]
    public async Task<IActionResult> DeleteImage(int id)
    {
        var image = await Context.ImageModels.FindAsync(id);
        if (image == null) return NotFound();

        Context.ImageModels.Remove(image);
        await Context.SaveChangesAsync();
        return Ok(new { success = true });
    }
    #endregion

    #region PriceList
    [HttpGet("getPriceList")]
    public async Task<IActionResult> GetPriceList()
    {
        return Ok(await Context.PriceListModels.ToListAsync());
    }

    [HttpPost("uploadPriceList")]
    public async Task<IActionResult> UploadPriceList([FromForm] string title, [FromForm] string price)
    {
        var newPriceList = new PriceListModel
        {
            Title = title,
            Price = int.Parse(price)
        };

        Context.PriceListModels.Add(newPriceList);
        await Context.SaveChangesAsync();
        return Ok(new { success = true });
    }

    [HttpPut("updatePriceList/{id}")]
    public async Task<IActionResult> UpdatePriceList(int id, [FromForm] string title, [FromForm] string price)
    {
        var priceList = await Context.PriceListModels.FindAsync(id);
        if (priceList == null) return NotFound();

        priceList.Title = title;
        priceList.Price = int.Parse(price);

        await Context.SaveChangesAsync();
        return Ok(new { success = true });
    }
    
    [HttpDelete("deletePriceList/{id}")]
    public async Task<IActionResult> DeletePriceList(int id)
    {
        var priceList = await Context.PriceListModels.FindAsync(id);
        if (priceList == null) return NotFound();

        Context.PriceListModels.Remove(priceList);
        await Context.SaveChangesAsync();
        return Ok(new { success = true });
    }
    #endregion

    #region FeedbackRequest
    [HttpGet("getFeedbackRequests")]
    public async Task<IActionResult> GetFeedbackRequests()
    {
        return Ok(await Context.FeedbackRequestModels.ToListAsync());
    }

    [HttpDelete("deleteFeedbackRequest/{id}")]
    public async Task<IActionResult> DeleteFeedbackRequest(int id){
        var feedbackRequest = await Context.FeedbackRequestModels.FindAsync(id);
        if(feedbackRequest == null) return NotFound();

        Context.FeedbackRequestModels.Remove(feedbackRequest);
        await Context.SaveChangesAsync();
        return Ok(new {success = true});
    }
    #endregion
}
