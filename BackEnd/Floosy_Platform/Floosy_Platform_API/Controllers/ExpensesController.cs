using Floosy_Platform_BLL.Interfaces;
using Floosy_Platform_DAL.Context;

using Floosy_Platform_Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class ExpensesController : ControllerBase
{
    private readonly IGenericRepository<Expenses> _repository;
    private readonly AppDbContext _context;
    
 

    public ExpensesController(IGenericRepository<Expenses> repository , AppDbContext context)
    {
        _repository = repository;
    _context = context;
}

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var expenses = await _repository.GetAll();
        return Ok(expenses);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var expense = await _context.Expenses.FindAsync(id);
        if (expense == null)
            return NotFound();

        return Ok(expense);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Expenses expenses)
    {
        await _repository.AddAsync(expenses);
        await _repository.Save();
        return CreatedAtAction(nameof(GetById), new { id = expenses.ExpensesId }, expenses);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Expenses expenses)
    {
        if (id != expenses.ExpensesId)
            return BadRequest();

        _repository.Update(expenses);
        await _repository.Save();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var expenses = await _context.Expenses.FindAsync(id);
        if (expenses == null)
            return NotFound();

        _repository.Remove(expenses);
        await _repository.Save();
        return NoContent();
    }
}
