

using Floosy_Platform_Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Floosy_Platform_DAL.Configurations
{
    public class AppUserConfiguration : IEntityTypeConfiguration<AppUser>
    {
        public void Configure(EntityTypeBuilder<AppUser> builder)
        {
            builder.Property(u => u.FullName)
                   .IsRequired()
                   .HasMaxLength(150);
        }
    }
}

