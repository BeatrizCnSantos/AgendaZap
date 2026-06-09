namespace AgendaZap.Api.Models;

public class Appointment
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public DateOnly AppointmentDate { get; set; }

    public TimeOnly StartTime { get; set; }

    public Guid CustomerId { get; set; }

    public Customer Customer { get; set; } = null!;

    public Guid ServiceId { get; set; }

    public Service Service { get; set; } = null!;

    public Guid BusinessId { get; set; }

    public Business Business { get; set; } = null!;
}