using AgendaZap.Api.Data;
using AgendaZap.Api.DTOs;
using AgendaZap.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;


namespace AgendaZap.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
//Pra facilitar os testes, a autenticação foi comentada. Para ativar, basta remover os comentários e garantir que o token JWT seja enviado no header Authorization das requisições.
//[Authorize]
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
            UserId = userId
        };

        _context.Businesses.Add(business);
        _context.SaveChanges();

        return Ok(new
        {
            business.Id,
            business.Name,
            business.WhatsAppNumber,
            business.Slug,
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
}