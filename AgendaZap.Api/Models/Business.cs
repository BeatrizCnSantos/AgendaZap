namespace AgendaZap.Api.Models;

public class Business
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;

    public string WhatsAppNumber { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    public ICollection<Service> Services { get; set; } = new List<Service>();

    public ICollection<Availability> Availabilities { get; set; } = new List<Availability>();
}