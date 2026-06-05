using AgendaZap.Api.Data;
using AgendaZap.Api.DTOs;
using AgendaZap.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace AgendaZap.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BusinessController : ControllerBase
{
    private readonly AppDbContext _context;

    public BusinessController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public IActionResult Create(CreateBusinessDto dto)
    {
        var user = _context.Users
            .FirstOrDefault(u => u.Id == dto.UserId);

        if (user == null)
        {
            return BadRequest(new
            {
                message = "Usuário não encontrado"
            });
        }

        var business = new Business
        {
            Name = dto.Name,
            WhatsAppNumber = dto.WhatsAppNumber,
            Slug = dto.Slug,
            UserId = dto.UserId
        };

        _context.Businesses.Add(business);
        _context.SaveChanges();

        return Ok(business);
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_context.Businesses.ToList());
    }
}