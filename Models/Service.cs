namespace AgendaZap.Api.Models;

public class Service
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int DurationMinutes { get; set; }

    public bool Active { get; set; } = true;

    public Guid BusinessId { get; set; }

    public Business Business { get; set; } = null!;
}