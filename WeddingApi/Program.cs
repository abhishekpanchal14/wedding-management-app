using WeddingApi;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Bind to Railway PORT or default to 80.
var port = Environment.GetEnvironmentVariable("PORT") ?? "80";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// Configure CORS for frontend dev server.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost5173", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add SQLite database
var dbPath = Environment.GetEnvironmentVariable("DATABASE_PATH") ?? "wedding.db";
builder.Services.AddDbContext<WeddingDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}")
);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowLocalhost5173");
app.UseHttpsRedirection();

// Serve static files from wwwroot/uploads
app.UseStaticFiles();
app.UseRouting();

// Create uploads directory if it doesn't exist
var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}

// Initialize database and apply migrations
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<WeddingDbContext>();
    db.Database.EnsureCreated();
}

app.MapGet("/api/vendors", async (WeddingDbContext db) => 
    Results.Ok(await db.Vendors.ToListAsync())
).WithName("GetVendors");

// Handle vendor creation with file uploads
app.MapPost("/api/vendors/upload", async (HttpRequest request, WeddingDbContext db) =>
{
    try
    {
        var form = await request.ReadFormAsync();
        
        // Extract form fields with validation
        var name = form["name"].ToString();
        var category = form["category"].ToString();
        var description = form["description"].ToString();
        var plan = form["plan"].ToString();
        
        // Validate required fields
        if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(category) || 
            string.IsNullOrWhiteSpace(description) || string.IsNullOrWhiteSpace(plan))
        {
            return Results.BadRequest(new { message = "Missing required fields" });
        }
        
        string? photoUrl = null;
        string? videoUrl = null;
        
        try
        {
            // Handle photo upload
            var photoFile = form.Files["photo"];
            if (photoFile != null && photoFile.Length > 0)
            {
                var photoFileName = $"photo_{Guid.NewGuid()}{Path.GetExtension(photoFile.FileName)}";
                var photoPath = Path.Combine(uploadsPath, photoFileName);
                
                using (var stream = new FileStream(photoPath, FileMode.Create))
                {
                    await photoFile.CopyToAsync(stream);
                }
                
                photoUrl = $"/uploads/{photoFileName}";
            }
            
            // Handle video upload
            var videoFile = form.Files["video"];
            if (videoFile != null && videoFile.Length > 0)
            {
                var videoFileName = $"video_{Guid.NewGuid()}{Path.GetExtension(videoFile.FileName)}";
                var videoPath = Path.Combine(uploadsPath, videoFileName);
                
                using (var stream = new FileStream(videoPath, FileMode.Create))
                {
                    await videoFile.CopyToAsync(stream);
                }
                
                videoUrl = $"/uploads/{videoFileName}";
            }
        }
        catch (Exception fileEx)
        {
            return Results.BadRequest(new { message = $"File upload error: {fileEx.Message}" });
        }
        
        var newVendor = new Vendor 
        { 
            Name = name, 
            Category = category, 
            Description = description, 
            Plan = plan, 
            PhotoUrl = photoUrl, 
            VideoUrl = videoUrl 
        };
        
        db.Vendors.Add(newVendor);
        await db.SaveChangesAsync();
        
        return Results.Created($"/api/vendors/{newVendor.Id}", newVendor);
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { message = $"Error: {ex.Message}" });
    }
}).WithName("AddVendorWithFiles");

app.MapPost("/api/vendors", async (Vendor newVendor, WeddingDbContext db) => {
    db.Vendors.Add(newVendor);
    await db.SaveChangesAsync();
    return Results.Created($"/api/vendors/{newVendor.Id}", newVendor);
}).WithName("AddVendor");

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" })).WithName("HealthCheck");

app.Run();

