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

    [HttpPut("{id}")]
    public IActionResult Update(Guid id, UpdateCustomerDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
    
        if (userIdClaim == null)
        {
            return Unauthorized();
        }
    
        var userId = Guid.Parse(userIdClaim.Value);
    
        var customer = _context.Appointments
            .Where(a => a.Business.UserId == userId)
            .Select(a => a.Customer)
            .FirstOrDefault(c => c.Id == id);
    
        if (customer == null)
        {
            return NotFound(new
            {
                message = "Cliente não encontrado"
            });
        }
    
        customer.Name = dto.Name;
        customer.Phone = dto.Phone;
    
        _context.SaveChanges();
    
        return Ok(new
        {
            customer.Id,
            customer.Name,
            customer.Phone
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
    
        var customer = _context.Appointments
            .Where(a => a.Business.UserId == userId)
            .Select(a => a.Customer)
            .FirstOrDefault(c => c.Id == id);
    
        if (customer == null)
        {
            return NotFound(new
            {
                message = "Cliente não encontrado"
            });
        }
    
        var hasAppointments = _context.Appointments
            .Any(a => a.CustomerId == id);
    
        if (hasAppointments)
        {
            return BadRequest(new
            {
                message = "Cliente possui agendamentos cadastrados"
            });
        }
    
        _context.Customers.Remove(customer);
        _context.SaveChanges();
    
        return Ok(new
        {
            message = "Cliente excluído com sucesso"
        });
    }
}