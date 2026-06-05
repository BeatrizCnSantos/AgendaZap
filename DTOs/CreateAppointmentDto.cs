namespace AgendaZap.Api.DTOs;

public class CreateAppointmentDto
{
    public string AppointmentDate { get; set; } = string.Empty;

    public string StartTime { get; set; } = string.Empty;

    public Guid CustomerId { get; set; }

    public Guid ServiceId { get; set; }

    public Guid BusinessId { get; set; }
}