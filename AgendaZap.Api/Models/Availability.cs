namespace AgendaZap.Api.Models;

public class Availability
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public DayOfWeek DayOfWeek { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    public Guid BusinessId { get; set; }

    public Business Business { get; set; } = null!;
}