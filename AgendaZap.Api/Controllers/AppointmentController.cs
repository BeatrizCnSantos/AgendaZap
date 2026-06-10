using AgendaZap.Api.Data;
using AgendaZap.Api.DTOs;
using AgendaZap.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace AgendaZap.Api.Controllers;


[ApiController]
[Route("api/[controller]")]
//[Authorize]
public class AppointmentController : ControllerBase
{
    private readonly AppDbContext _context;

    public AppointmentController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]

    [HttpGet]
    public IActionResult GetAll()
    {
    //    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
//
    //    if (userIdClaim == null)
    //    {
    //        return Unauthorized();
    //    }
    //    
//
    //    var userId = Guid.Parse(userIdClaim.Value);
//
        var appointments = _context.Appointments
            .Select(a => new
            {
                a.Id,
                a.AppointmentDate,
                a.StartTime,

                a.CustomerId,
                CustomerName = a.Customer.Name,
                CustomerPhone = a.Customer.Phone,

                a.ServiceId,
                ServiceName = a.Service.Name,

                a.BusinessId
            })
            .ToList();

        return Ok(appointments);
    }

    [HttpPost]
    public IActionResult Create(CreateAppointmentDto dto)
    {
        var appointmentDate = DateOnly.Parse(dto.AppointmentDate);
        var appointmentTime = TimeOnly.Parse(dto.StartTime);

        var service = _context.Services
            .FirstOrDefault(s => s.Id == dto.ServiceId);

        if (service == null)
        {
            return BadRequest(new { message = "Serviço não encontrado" });
        }

        var appointmentEndTime = appointmentTime.AddMinutes(service.DurationMinutes);

        var availability = _context.Availabilities
            .FirstOrDefault(a =>
                a.BusinessId == dto.BusinessId &&
                a.DayOfWeek == appointmentDate.DayOfWeek);

        if (availability == null)
        {
            return BadRequest(new { message = "Empresa não atende nesse dia" });
        }

        if (appointmentTime < availability.StartTime ||
            appointmentEndTime > availability.EndTime)
        {
            return BadRequest(new { message = "Horário fora do período de atendimento" });
        }

        var existingAppointments = _context.Appointments
            .Where(a =>
                a.BusinessId == dto.BusinessId &&
                a.AppointmentDate == appointmentDate)
            .ToList();

        foreach (var existing in existingAppointments)
        {
            var existingService = _context.Services
                .FirstOrDefault(s => s.Id == existing.ServiceId);

            if (existingService == null)
                continue;

            var existingEndTime = existing.StartTime.AddMinutes(existingService.DurationMinutes);

            bool overlap =
                appointmentTime < existingEndTime &&
                appointmentEndTime > existing.StartTime;

            if (overlap)
            {
                return BadRequest(new { message = "Horário já ocupado" });
            }
        }

        var appointment = new Appointment
        {
            AppointmentDate = appointmentDate,
            StartTime = appointmentTime,
            CustomerId = dto.CustomerId,
            ServiceId = dto.ServiceId,
            BusinessId = dto.BusinessId
        };

        _context.Appointments.Add(appointment);
        _context.SaveChanges();

        var business = _context.Businesses
            .FirstOrDefault(b => b.Id == dto.BusinessId);

        var customer = _context.Customers
            .FirstOrDefault(c => c.Id == dto.CustomerId);

        var message = $"Olá {customer?.Name}, seu agendamento foi confirmado para {appointment.AppointmentDate} às {appointment.StartTime}.";

        var encodedMessage = Uri.EscapeDataString(message);

        var whatsAppLink = $"https://wa.me/{business?.WhatsAppNumber}?text={encodedMessage}";

        return Ok(new
        {
            appointment.Id,
            appointment.AppointmentDate,
            appointment.StartTime,
            EndTime = appointmentEndTime,
            appointment.CustomerId,
            appointment.ServiceId,
            appointment.BusinessId,
            whatsAppLink
        });
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(Guid id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId = Guid.Parse(userIdClaim.Value);

        var appointment = _context.Appointments
            .FirstOrDefault(a =>
                a.Id == id &&
                a.Business.UserId == userId);

        if (appointment == null)
        {
            return NotFound(new
            {
                message = "Agendamento não encontrado"
            });
        }

        _context.Appointments.Remove(appointment);
        _context.SaveChanges();

        return Ok(new
        {
            message = "Agendamento cancelado com sucesso"
        });
    }

    [HttpPut("{id}")]
    public IActionResult Update(Guid id, UpdateAppointmentDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId = Guid.Parse(userIdClaim.Value);

        var appointment = _context.Appointments
            .FirstOrDefault(a =>
                a.Id == id &&
                a.Business.UserId == userId);

        if (appointment == null)
        {
            return NotFound(new
            {
                message = "Agendamento não encontrado"
            });
        }

        var appointmentDate = DateOnly.Parse(dto.AppointmentDate);
        var appointmentTime = TimeOnly.Parse(dto.StartTime);

        var service = _context.Services
            .FirstOrDefault(s => s.Id == appointment.ServiceId);

        if (service == null)
        {
            return BadRequest(new
            {
                message = "Serviço não encontrado"
            });
        }

        var appointmentEndTime =
            appointmentTime.AddMinutes(service.DurationMinutes);

        var availability = _context.Availabilities
            .FirstOrDefault(a =>
                a.BusinessId == appointment.BusinessId &&
                a.DayOfWeek == appointmentDate.DayOfWeek);

        if (availability == null)
        {
            return BadRequest(new
            {
                message = "Empresa não atende nesse dia"
            });
        }

        if (appointmentTime < availability.StartTime ||
            appointmentEndTime > availability.EndTime)
        {
            return BadRequest(new
            {
                message = "Horário fora do período de atendimento"
            });
        }

        var existingAppointments = _context.Appointments
            .Where(a =>
                a.BusinessId == appointment.BusinessId &&
                a.AppointmentDate == appointmentDate &&
                a.Id != id)
            .ToList();

        foreach (var existing in existingAppointments)
        {
            var existingService = _context.Services
                .FirstOrDefault(s => s.Id == existing.ServiceId);

            if (existingService == null)
                continue;

            var existingEndTime =
                existing.StartTime.AddMinutes(existingService.DurationMinutes);

            bool overlap =
                appointmentTime < existingEndTime &&
                appointmentEndTime > existing.StartTime;

            if (overlap)
            {
                return BadRequest(new
                {
                    message = "Horário já ocupado"
                });
            }
        }

        appointment.AppointmentDate = appointmentDate;
        appointment.StartTime = appointmentTime;

        _context.SaveChanges();

        return Ok(new
        {
            appointment.Id,
            appointment.AppointmentDate,
            appointment.StartTime
        });
    }
}