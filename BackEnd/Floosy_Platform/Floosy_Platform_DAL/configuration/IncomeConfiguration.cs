
    using Floosy_Platform_Models;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Metadata.Builders;

    namespace Floosy_Platform_DAL.Configurations
    {
        public class IncomeConfiguration : IEntityTypeConfiguration<Income>
        {
            public void Configure(EntityTypeBuilder<Income> builder)
            {
                builder.HasKey(e => e.IncomeId);

                builder.Property(e => e.Month_year)
                       .IsRequired()
                       .HasMaxLength(20);

                builder.Property(e => e.EmploymentIncome).HasColumnType("decimal(18,2)");
                builder.Property(e => e.SelfEmploymentIncome).HasColumnType("decimal(18,2)");
                builder.Property(e => e.RentalIncome).HasColumnType("decimal(18,2)");
                builder.Property(e => e.RoyaltyIncome).HasColumnType("decimal(18,2)");
                builder.Property(e => e.InterestIncome).HasColumnType("decimal(18,2)");
                builder.Property(e => e.DividendSukukIncome).HasColumnType("decimal(18,2)");
                builder.Property(e => e.RealEstateDisposalGains).HasColumnType("decimal(18,2)");
                builder.Property(e => e.RetirementEosbIncome).HasColumnType("decimal(18,2)");
                builder.Property(e => e.PrizeIncome).HasColumnType("decimal(18,2)");
                builder.Property(e => e.Grants).HasColumnType("decimal(18,2)");
                builder.Property(e => e.BoardMemberCompensation).HasColumnType("decimal(18,2)");

                builder.Property(e => e.CreateAt)
                       .HasDefaultValueSql("GETDATE()");

                builder.HasOne(e => e.user)
                       .WithMany()
                       .HasForeignKey(e => e.userId)
                       .OnDelete(DeleteBehavior.Cascade);
            }
        }
    }
