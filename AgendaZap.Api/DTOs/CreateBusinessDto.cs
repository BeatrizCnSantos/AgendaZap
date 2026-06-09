namespace AgendaZap.Api.DTOs;

public class CreateBusinessDto
{
    public string Name { get; set; } = string.Empty;

    public string WhatsAppNumber { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public string LogoUrl { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public string Instagram { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string OpeningHours { get; set; } = string.Empty;
}