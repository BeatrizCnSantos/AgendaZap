using AgendaZap.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AgendaZap.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
}