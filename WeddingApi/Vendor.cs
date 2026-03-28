namespace WeddingApi;

public class Vendor
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Plan { get; set; } = string.Empty;
    public string? PhotoUrl { get; set; }
    public string? VideoUrl { get; set; }
}
