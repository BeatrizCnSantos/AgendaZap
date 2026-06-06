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
public class CustomerController : ControllerBase
{
    private readonly AppDbContext _context;

    public CustomerController(AppDbContext context)
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

        var customers = _context.Appointments
            .Where(a => a.Business.UserId == userId)
            .Select(a => new
            {
                a.Customer.Id,
                a.Customer.Name,
                a.Customer.Phone
            })
            .Distinct()
            .ToList();

        return Ok(customers);
    }

    [HttpPost]
    public IActionResult Create(CreateCustomerDto dto)
    {
        var customer = new Customer
        {
            Name = dto.Name,
            Phone = dto.Phone
        };

        _context.Customers.Add(customer);
        _context.SaveChanges();

        return Ok(new
        {
            customer.Id,
            customer.Name,
            customer.Phone
        });
    }
}