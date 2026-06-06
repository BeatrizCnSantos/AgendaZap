namespace AgendaZap.Api.DTOs;

public class UpdateAppointmentDto
{
    public string AppointmentDate { get; set; } = string.Empty;

    public string StartTime { get; set; } = string.Empty;
}