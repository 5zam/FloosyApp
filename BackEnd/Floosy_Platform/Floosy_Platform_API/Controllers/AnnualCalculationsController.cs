using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Floosy_Platform_DAL.Context;
using Floosy_Platform_Models;
using Floosy_Platform_BLL.Interfaces;
using Floosy_Platform_BLL.Repositories;

namespace Floosy_Platform_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnualCalculationsController : ControllerBase
    {
        private readonly IGenericRepository<AnnualCalculation> _context;
        private readonly AppDbContext _appDbContext;

        public AnnualCalculationsController(IGenericRepository<AnnualCalculation> context,AppDbContext appDb)
        {
            _context = context;
            _appDbContext = appDb;
        }

        // GET: api/AnnualCalculations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AnnualCalculation>>> GetAnnualCalculations()
        {
            var annualCalculations = await _context.GetAll();
            return Ok(annualCalculations);
        }

        // GET: api/AnnualCalculations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<AnnualCalculation>>> GetAnnualCalculation(int id)
        {
            var annualCalculation = await _appDbContext.AnnualCalculations.Where(x=>x.userId==id.ToString()).ToListAsync();

          
            return annualCalculation;
        }

        // PUT: api/AnnualCalculations/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAnnualCalculation(int id,[FromBody] AnnualCalculation annualCalculation)
        {
            if (id != annualCalculation.AnnualCalculationId)
            {
                return BadRequest();
            }

            _context.Update(annualCalculation);

            await _context.Save();

            return NoContent();
        }

        // POST: api/AnnualCalculations
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AnnualCalculation>> PostAnnualCalculation([FromBody]AnnualCalculation annualCalculation)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
               
               
            }
            
            await _context.AddAsync(annualCalculation);
            await _context.Save();
           

            return CreatedAtAction("GetAnnualCalculation", new { id = annualCalculation.AnnualCalculationId }, annualCalculation);
        }

        // DELETE: api/AnnualCalculations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnnualCalculation(int id)
        {
            var annualCalculation = await _appDbContext.AnnualCalculations.FindAsync(id);
            if (annualCalculation == null)
            {
                return NotFound();
            }

            _context.Remove(annualCalculation);
            await _context.Save();

            return NoContent();
        }

        
    }
}
