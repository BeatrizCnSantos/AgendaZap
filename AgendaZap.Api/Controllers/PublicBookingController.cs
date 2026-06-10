using AgendaZap.Api.Data;
using AgendaZap.Api.DTOs;
using AgendaZap.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace AgendaZap.Api.Controllers;

[ApiController]
[Route("api/public/booking")]
public class PublicBookingController : ControllerBase
{
    private readonly AppDbContext _context;

    public PublicBookingController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{slug}")]
    public IActionResult GetBusinessBySlug(string slug)
    {
        var business = _context.Businesses
            .Where(b => b.Slug == slug)
            .Select(b => new
            {
                b.Id,
                b.Name,
                b.WhatsAppNumber,
                b.Slug,
                b.LogoUrl,
                b.Address,
                b.Instagram,
                b.Description,

                Services = b.Services
                    .Where(s => s.Active)
                    .Select(s => new
                    {
                        s.Id,
                        s.Name,
                        s.Description,
                        s.Price,
                        s.DurationMinutes
                    })
                    .ToList(),

                Availabilities = b.Availabilities
                    .Select(a => new
                    {
                        a.Id,
                        a.DayOfWeek,
                        a.StartTime,
                        a.EndTime
                    })
                    .ToList()
            })
            .FirstOrDefault();

        if (business == null)
        {
            return NotFound(new
            {
                message = "Empresa não encontrada"
            });
        }

        return Ok(business);
    }

    [HttpGet("{slug}/slots")]
    public IActionResult GetAvailableSlots(string slug, Guid serviceId, string date)
    {
        var business = _context.Businesses
            .FirstOrDefault(b => b.Slug == slug);
    
        if (business == null)
        {
            return NotFound(new { message = "Empresa não encontrada" });
        }
    
        var service = _context.Services
            .FirstOrDefault(s => s.Id == serviceId && s.BusinessId == business.Id);
    
        if (service == null)
        {
            return NotFound(new { message = "Serviço não encontrado" });
        }
    
        var appointmentDate = DateOnly.Parse(date);
    
        var availability = _context.Availabilities
            .FirstOrDefault(a =>
                a.BusinessId == business.Id &&
                a.DayOfWeek == appointmentDate.DayOfWeek);
    
        if (availability == null)
        {
            return Ok(new List<string>());
        }
    
        var appointments = _context.Appointments
            .Where(a =>
                a.BusinessId == business.Id &&
                a.AppointmentDate == appointmentDate)
            .ToList();
    
        var slots = new List<string>();
    
        var currentTime = availability.StartTime;
        var endTime = availability.EndTime;
        var serviceDuration = service.DurationMinutes;
    
        while (currentTime.AddMinutes(serviceDuration) <= endTime)
        {
            var slotEndTime = currentTime.AddMinutes(serviceDuration);
    
            var hasConflict = appointments.Any(appointment =>
            {
                var appointmentService = _context.Services
                    .FirstOrDefault(s => s.Id == appointment.ServiceId);
    
                if (appointmentService == null)
                    return false;
    
                var appointmentEndTime =
                    appointment.StartTime.AddMinutes(appointmentService.DurationMinutes);
    
                return currentTime < appointmentEndTime &&
                       slotEndTime > appointment.StartTime;
            });
    
            if (!hasConflict)
            {
                slots.Add(currentTime.ToString("HH:mm"));
            }
    
            currentTime = currentTime.AddMinutes(serviceDuration);
        }
    
        return Ok(slots);
    }
}