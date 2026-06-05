using AgendaZap.Api.Data;
using AgendaZap.Api.DTOs;
using AgendaZap.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace AgendaZap.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentController : ControllerBase
{
    private readonly AppDbContext _context;

    public AppointmentController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var appointments = _context.Appointments
            .Select(a => new
            {
                a.Id,
                a.AppointmentDate,
                a.StartTime,
                a.CustomerId,
                a.ServiceId,
                a.BusinessId
            })
            .ToList();

        return Ok(appointments);
    }

    [HttpPost]
    public IActionResult Create(CreateAppointmentDto dto)
    {

        var existingAppointment = _context.Appointments
        .FirstOrDefault(a =>
        a.BusinessId == dto.BusinessId &&
        a.AppointmentDate == DateOnly.Parse(dto.AppointmentDate) &&
        a.StartTime == TimeOnly.Parse(dto.StartTime));

        if (existingAppointment != null)
        {
            return BadRequest(new
            {
                message = "Horário já ocupado"
            });
        }

        var availability = _context.Availabilities
        .FirstOrDefault(a =>
        a.BusinessId == dto.BusinessId &&
        a.DayOfWeek == DateOnly.Parse(dto.AppointmentDate).DayOfWeek);

        if (availability == null)
        {
            return BadRequest(new
            {
                message = "Empresa não atende nesse dia"
            });
        }

        var appointmentTime = TimeOnly.Parse(dto.StartTime);

        if (appointmentTime < availability.StartTime ||
            appointmentTime > availability.EndTime)
        {
            return BadRequest(new
            {
                message = "Horário fora do período de atendimento"
            });
        }

        var appointment = new Appointment
        {
            AppointmentDate = DateOnly.Parse(dto.AppointmentDate),
            StartTime = TimeOnly.Parse(dto.StartTime),
            CustomerId = dto.CustomerId,
            ServiceId = dto.ServiceId,
            BusinessId = dto.BusinessId
        };

        _context.Appointments.Add(appointment);
        _context.SaveChanges();

        return Ok(new
        {
            appointment.Id,
            appointment.AppointmentDate,
            appointment.StartTime,
            appointment.CustomerId,
            appointment.ServiceId,
            appointment.BusinessId
        });

    }    
}