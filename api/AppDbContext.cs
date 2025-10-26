using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}
    public DbSet<ImageModel> ImageModels { get; set; } 
    public DbSet<PriceListModel> PriceListModels {get; set;}
    public DbSet<FeedbackRequestModel> FeedbackRequestModels {get; set;}
}