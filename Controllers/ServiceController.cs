using AgendaZap.Api.Data;
using AgendaZap.Api.DTOs;
using AgendaZap.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace AgendaZap.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServiceController : ControllerBase
{
    private readonly AppDbContext _context;

    public ServiceController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public IActionResult Create(CreateServiceDto dto)
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

        var service = new Service
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            DurationMinutes = dto.DurationMinutes,
            BusinessId = dto.BusinessId
        };

        _context.Services.Add(service);
        _context.SaveChanges();

        return Ok(new
        {
            service.Id,
            service.Name,
            service.Description,
            service.Price,
            service.DurationMinutes,
            service.Active,
            service.BusinessId
        });
    }
}
