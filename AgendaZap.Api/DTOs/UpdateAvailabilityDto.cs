namespace AgendaZap.Api.DTOs;

public class UpdateAvailabilityDto
{
    public int DayOfWeek { get; set; }

    public string StartTime { get; set; } = string.Empty;

    public string EndTime { get; set; } = string.Empty;
}