using Microsoft.EntityFrameworkCore;

namespace WeddingApi;

public class WeddingDbContext : DbContext
{
    public WeddingDbContext(DbContextOptions<WeddingDbContext> options) : base(options)
    {
    }

    public DbSet<Vendor> Vendors { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed initial vendors
        modelBuilder.Entity<Vendor>().HasData(
            new Vendor { Id = 1, Name = "Sunset Studio", Category = "Photographer", Description = "Full-day photo + video package", Plan = "Premium" },
            new Vendor { Id = 2, Name = "Luxe Events", Category = "Event Planner", Description = "Venue coordination + decor", Plan = "Ultimate" },
            new Vendor { Id = 3, Name = "Giovanni Catering", Category = "Caterer", Description = "Custom menu with tasting session", Plan = "Standard" },
            new Vendor { Id = 4, Name = "Floral Bliss", Category = "Decorator", Description = "Floral and lighting design", Plan = "Premium" }
        );
    }
}
