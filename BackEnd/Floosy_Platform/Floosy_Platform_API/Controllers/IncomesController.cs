using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Floosy_Platform_DAL.Context;
using Floosy_Platform_Models;
using Floosy_Platform_BLL.Repositories;
using Floosy_Platform_BLL.Interfaces;

namespace Floosy_Platform_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IncomesController : ControllerBase
    {
        private readonly IGenericRepository<Income> _context;
        private readonly AppDbContext _appdb;

        public IncomesController(IGenericRepository<Income> context, AppDbContext appdb)
        {
            _context = context;
            _appdb = appdb;
        }

        // GET: api/Incomes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Income>>> GetIncomes()
        {
            var income= await _context.GetAll();
            return Ok(income);
        }

        // GET: api/Incomes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Income>>> GetIncome(int id)
        {
            var income = await _appdb.Incomes.Where(x=>x.userId==id.ToString()).ToListAsync();

            return income;
        }

        // PUT: api/Incomes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIncome(int id,[FromBody] Income income)
        {
            if (id != income.IncomeId)
            {
                return BadRequest();
            }

            _context.Update(income);
            await _context.Save();

            return NoContent();
        }

        // POST: api/Incomes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Income>> PostIncome([FromBody] Income income)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _context.AddAsync(income);
            await _context.Save();

            return CreatedAtAction("GetIncome", new { id = income.IncomeId }, income);
        }

        // DELETE: api/Incomes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIncome(int id)
        {
            await _context.Remove(id);
            await _context.Save();

            return NoContent();
        }

        
    }
}
