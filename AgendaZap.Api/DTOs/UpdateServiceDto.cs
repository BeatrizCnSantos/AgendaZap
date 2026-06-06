namespace AgendaZap.Api.DTOs;

public class UpdateServiceDto
{
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int DurationMinutes { get; set; }

    public bool Active { get; set; } = true;
}