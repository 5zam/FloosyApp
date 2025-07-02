

using Floosy_Platform_Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Floosy_Platform_DAL.Configurations
{
    public class AnnualCalculationConfiguration : IEntityTypeConfiguration<AnnualCalculation>
    {
        public void Configure(EntityTypeBuilder<AnnualCalculation> builder)
        {
            builder.HasKey(e => e.AnnualCalculationId);

            builder.Property(e => e.Year)
                   .IsRequired()
                   .HasMaxLength(10);

            builder.Property(e => e.Month_year)
                   .IsRequired()
                   .HasMaxLength(20);

            builder.Property(e => e.TotalIncome).HasColumnType("decimal(18,2)");
            builder.Property(e => e.TotalExpenses).HasColumnType("decimal(18,2)");
            builder.Property(e => e.Tax).HasColumnType("decimal(18,2)");

            builder.Property(e => e.CreateAt)
                   .HasDefaultValueSql("GETDATE()");

            builder.HasOne(e => e.user)
                   .WithMany()
                   .HasForeignKey(e => e.userId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
