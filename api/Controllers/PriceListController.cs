using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class PriceListModelController : ControllerBase
{
    private readonly AppDbContext Context;

    public PriceListModelController(AppDbContext context){
        this.Context = context;
    }

    
    [HttpGet]
    public async Task<IActionResult> GetPriceList()
    {
        return Ok(await Context.PriceListModels.ToListAsync());
    }
}