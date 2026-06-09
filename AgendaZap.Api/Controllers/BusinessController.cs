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
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }   

        var userId = Guid.Parse(userIdClaim.Value);

        var user = _context.Users
            .FirstOrDefault(u => u.Id == userId);

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
            UserId = userId,
            LogoUrl = dto.LogoUrl,
            Address = dto.Address,
            Instagram = dto.Instagram,
            Description = dto.Description,
        };

        _context.Businesses.Add(business);
        _context.SaveChanges();

        return Ok(new
        {
            business.Id,
            business.Name,
            business.WhatsAppNumber,
            business.Slug,
            business.LogoUrl,
            business.Address,
            business.Instagram,
            business.Description,
            business.UserId
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
        
        var businesses = _context.Businesses
            .Where(b => b.UserId == userId)
            .ToList();
        
        return Ok(businesses);
    }

    [HttpPut("{id}")]
    public IActionResult Update(Guid id, UpdateBusinessDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId = Guid.Parse(userIdClaim.Value);

        var business = _context.Businesses
            .FirstOrDefault(b =>
                b.Id == id &&
                b.UserId == userId);

        if (business == null)
        {
            return NotFound(new
            {
                message = "Empresa não encontrada"
            });
        }

        business.Name = dto.Name;
        business.WhatsAppNumber = dto.WhatsAppNumber;
        business.Slug = dto.Slug;
        business.LogoUrl = dto.LogoUrl;
        business.Address = dto.Address;
        business.Instagram = dto.Instagram;
        business.Description = dto.Description;

        _context.SaveChanges();

        return Ok(new
        {
            business.Id,
            business.Name,
            business.WhatsAppNumber,
            business.Slug,
            business.LogoUrl,
            business.Address,
            business.Instagram,
            business.Description,

            business.UserId
        });
    }
}