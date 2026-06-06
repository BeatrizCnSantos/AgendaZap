using AgendaZap.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AgendaZap.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
//Pra facilitar os testes, a autenticação foi comentada. Para ativar, basta remover os comentários e garantir que o token JWT seja enviado no header Authorization das requisições.
//[Authorize]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetStats()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId = Guid.Parse(userIdClaim.Value);

        return Ok(new
        {
            totalBusinesses = _context.Businesses
                .Count(b => b.UserId == userId),

            totalServices = _context.Services
                .Count(s => s.Business.UserId == userId),

            totalCustomers = _context.Appointments
                .Where(a => a.Business.UserId == userId)
                .Select(a => a.CustomerId)
                .Distinct()
                .Count(),

            totalAppointments = _context.Appointments
                .Count(a => a.Business.UserId == userId)
        });
    }
}