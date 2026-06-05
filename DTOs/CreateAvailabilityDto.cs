namespace AgendaZap.Api.DTOs;

public class CreateAvailabilityDto
{
    public int DayOfWeek { get; set; }

    public string StartTime { get; set; } = string.Empty;

    public string EndTime { get; set; } = string.Empty;

    public Guid BusinessId { get; set; }
}