using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProductCategory.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProductCategory.Repo
{
    public class ApplicationContext : IdentityDbContext
    {
        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
        {
        }
        public DbSet<Product> Products { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Product>(p =>
                {
                    p.Property(u => u.Id).HasDefaultValueSql("newsequentialid()");
                });
        }
    }
}
