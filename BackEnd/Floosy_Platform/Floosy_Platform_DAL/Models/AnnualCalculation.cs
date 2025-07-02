using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Floosy_Platform_Models
{
    public class AnnualCalculation
    {
        public int AnnualCalculationId { get; set; }
        public string userId { get; set; }
        public string Year { get; set; }
        public decimal TotalIncome { get; set; }

        public decimal TotalExpenses  { get; set; }
        public decimal Tax { get; set; }
        public string Month_year { get; set; }
        public DateTime CreateAt { get; set; }


        public AppUser user { get; set; }

    }
}
