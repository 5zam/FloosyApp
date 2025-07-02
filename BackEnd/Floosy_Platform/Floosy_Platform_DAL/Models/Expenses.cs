using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Floosy_Platform_Models
{
    public class Expenses
    {
        public int ExpensesId { get; set; }
        public string userId { get; set; }
        public decimal Education_Expenses { get; set; }
        public decimal Healthcare_Expenses { get; set; }
        public decimal Interest { get; set; }
        public decimal Zakat { get; set; }
        public string Month_year { get; set; }
        public DateTime CreateAt { get; set; }


        public AppUser user { get; set; }

    }
}
