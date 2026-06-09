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
}