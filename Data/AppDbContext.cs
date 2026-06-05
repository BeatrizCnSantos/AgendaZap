using AgendaZap.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AgendaZap.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options): base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<Business> Businesses => Set<Business>();

    public DbSet<Service> Services => Set<Service>();

    public DbSet<Availability> Availabilities => Set<Availability>();

    public DbSet<Customer> Customers => Set<Customer>();
}