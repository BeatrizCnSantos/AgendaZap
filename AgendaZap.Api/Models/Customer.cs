namespace AgendaZap.Api.Models;

public class Customer
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public Guid? BusinessId { get; set; }

    public Business? Business { get; set; }
}