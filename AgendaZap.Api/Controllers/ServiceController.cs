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

    [HttpGet]
    public IActionResult GetAll()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId = Guid.Parse(userIdClaim.Value);

        var services = _context.Services
            .Where(s => s.Business.UserId == userId)
            .Select(s => new
            {
                s.Id,
                s.Name,
                s.Description,
                s.Price,
                s.DurationMinutes,
                s.BusinessId
            })
            .ToList();

        return Ok(services);
    }

    [HttpPut("{id}")]
    public IActionResult Update(Guid id, UpdateServiceDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId = Guid.Parse(userIdClaim.Value);

        var service = _context.Services
            .FirstOrDefault(s =>
                s.Id == id &&
                s.Business.UserId == userId);

        if (service == null)
        {
            return NotFound(new
            {
                message = "Serviço não encontrado"
            });
        }

        service.Name = dto.Name;
        service.Description = dto.Description;
        service.Price = dto.Price;
        service.DurationMinutes = dto.DurationMinutes;
        service.Active = dto.Active;

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

    [HttpDelete("{id}")]
    public IActionResult Delete(Guid id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
    
        if (userIdClaim == null)
        {
            return Unauthorized();
        }
    
        var userId = Guid.Parse(userIdClaim.Value);
    
        var service = _context.Services
            .FirstOrDefault(s =>
                s.Id == id &&
                s.Business.UserId == userId);
    
        if (service == null)
        {
            return NotFound(new
            {
                message = "Serviço não encontrado"
            });
        }
    
        var hasAppointments = _context.Appointments
            .Any(a => a.ServiceId == id);
    
        if (hasAppointments)
        {
            return BadRequest(new
            {
                message = "Não é possível excluir um serviço com agendamentos cadastrados"
            });
        }
    
        _context.Services.Remove(service);
        _context.SaveChanges();
    
        return Ok(new
        {
            message = "Serviço excluído com sucesso"
        });
    }
}
