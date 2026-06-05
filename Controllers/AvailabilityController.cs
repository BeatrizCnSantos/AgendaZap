using AgendaZap.Api.Data;
using AgendaZap.Api.DTOs;
using AgendaZap.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace AgendaZap.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AvailabilityController : ControllerBase
{
    private readonly AppDbContext _context;

    public AvailabilityController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public IActionResult Create(CreateAvailabilityDto dto)
    {
        var business = _context.Businesses
            .FirstOrDefault(b => b.Id == dto.BusinessId);

        if (business == null)
        {
            return BadRequest(new
            {
                message = "Empresa não encontrada"
            });
        }

        var availability = new Availability
        {
            DayOfWeek = (DayOfWeek)dto.DayOfWeek,
            StartTime = TimeOnly.Parse(dto.StartTime),
            EndTime = TimeOnly.Parse(dto.EndTime),
            BusinessId = dto.BusinessId
        };

        _context.Availabilities.Add(availability);
        _context.SaveChanges();

        return Ok(new
        {
            availability.Id,
            availability.DayOfWeek,
            availability.StartTime,
            availability.EndTime,
            availability.BusinessId
        });
    }
}