using Microsoft.EntityFrameworkCore;
using InterceptionCanvas.Models;

namespace InterceptionCanvas.Service
{
    /// <summary>
    /// Сервис для работы с БД
    /// </summary>
    public class DataBaseContext : DbContext
    {
        public DbSet<Figure>? Figure { get; set; }

        public DataBaseContext(DbContextOptions<DataBaseContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        /// <summary>
        /// Маппируем поля БД на поля нашей сущности Figure        
        /// </summary>
        /// <param name="modelBuilder"></param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Figure>()
                .Property(b => b.start).HasColumnName("start");

            modelBuilder.Entity<Figure>()
                .Property(b => b.end).HasColumnName("end");
        }
    }
}
