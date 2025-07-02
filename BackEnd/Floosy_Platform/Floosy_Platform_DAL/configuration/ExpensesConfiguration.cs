using Floosy_Platform_Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Floosy_Platform_DAL.Configurations
{
    public class ExpensesConfiguration : IEntityTypeConfiguration<Expenses>
    {
        public void Configure(EntityTypeBuilder<Expenses> builder)
        {
            builder.HasKey(e => e.ExpensesId);

            builder.Property(e => e.Month_year)
                   .IsRequired()
                   .HasMaxLength(20);

            builder.Property(e => e.Education_Expenses)
                   .HasColumnType("decimal(18,2)");

            builder.Property(e => e.Healthcare_Expenses)
                   .HasColumnType("decimal(18,2)");

            builder.Property(e => e.Interest)
                   .HasColumnType("decimal(18,2)");

            builder.Property(e => e.Zakat)
                   .HasColumnType("decimal(18,2)");

            builder.Property(e => e.CreateAt)
                   .HasDefaultValueSql("GETDATE()");

            builder.HasOne(e => e.user)
                   .WithMany()
                   .HasForeignKey(e => e.userId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
