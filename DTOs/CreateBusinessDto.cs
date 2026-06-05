namespace AgendaZap.Api.DTOs;

public class CreateBusinessDto
{
    public string Name { get; set; } = string.Empty;

    public string WhatsAppNumber { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public Guid UserId { get; set; }
}