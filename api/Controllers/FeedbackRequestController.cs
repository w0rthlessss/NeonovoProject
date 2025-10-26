using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class FeedbackRequestController : ControllerBase
{
    private readonly AppDbContext Context;

    public FeedbackRequestController(AppDbContext context)
    {
        Context = context;
    }

    [HttpPost]
    public async Task<IActionResult> SendFeedbackRequest([FromBody] FeedbackRequestModel request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { message = "Invalid request data" });
        }

        try
        {
            Context.FeedbackRequestModels.Add(request);
            await Context.SaveChangesAsync();

            return Ok(new { success = true, message = "Feedback request sent successfully" });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred while processing your request" });
        }
    }
}
