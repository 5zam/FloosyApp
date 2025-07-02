using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Floosy_Platform_Models
{
    public class Income
    {
        public int IncomeId { get; set; }
        public string userId { get; set; }

        public decimal EmploymentIncome { get; set; }
        public decimal SelfEmploymentIncome { get; set; }
        public decimal RentalIncome { get; set; }
        public decimal RoyaltyIncome { get; set; }
        public decimal InterestIncome { get; set; }
        public decimal DividendSukukIncome { get; set; }
        public decimal RealEstateDisposalGains { get; set; }
        public decimal RetirementEosbIncome { get; set; }
        public decimal PrizeIncome { get; set; }
        public decimal Grants { get; set; }
        public decimal BoardMemberCompensation { get; set; }


        public string Month_year { get; set; }
        public DateTime CreateAt { get; set; }
        public AppUser user { get; set; }
    }
}
