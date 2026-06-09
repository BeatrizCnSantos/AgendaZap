using AgendaZap.Api.Data;
using AgendaZap.Api.DTOs;
using AgendaZap.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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

    [HttpGet]
    public IActionResult GetAll()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId = Guid.Parse(userIdClaim.Value);

        var availabilities = _context.Availabilities
            .Where(a => a.Business.UserId == userId)
            .Select(a => new
            {
                a.Id,
                a.DayOfWeek,
                a.StartTime,
                a.EndTime,
                a.BusinessId
            })
            .ToList();

        return Ok(availabilities);
    }

    [HttpPost]
    public IActionResult Create(CreateAvailabilityDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId = Guid.Parse(userIdClaim.Value);

        var business = _context.Businesses
            .FirstOrDefault(b =>
                b.Id == dto.BusinessId &&
                b.UserId == userId);

        if (business == null)
        {
            return BadRequest(new
            {
                message = "Empresa não encontrada ou não pertence ao usuário"
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

    [HttpPut("{id}")]
    public IActionResult Update(Guid id, UpdateAvailabilityDto dto)
    {
        var availability = _context.Availabilities
            .FirstOrDefault(a => a.Id == id);

        if (availability == null)
        {
            return NotFound(new
            {
                message = "Disponibilidade não encontrada"
            });
        }

        availability.DayOfWeek = (DayOfWeek)dto.DayOfWeek;
        availability.StartTime = TimeOnly.Parse(dto.StartTime);
        availability.EndTime = TimeOnly.Parse(dto.EndTime);

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

    [HttpDelete("{id}")]
    public IActionResult Delete(Guid id)
    {
        var availability = _context.Availabilities
            .FirstOrDefault(a => a.Id == id);

        if (availability == null)
        {
            return NotFound(new
            {
                message = "Disponibilidade não encontrada"
            });
        }

        _context.Availabilities.Remove(availability);
        _context.SaveChanges();

        return Ok(new
        {
            message = "Disponibilidade excluída com sucesso"
        });
    }
}