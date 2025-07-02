using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Floosy_Platform_BLL.Interfaces;
using Floosy_Platform_DAL.Context;
using Microsoft.EntityFrameworkCore;

namespace Floosy_Platform_BLL.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly AppDbContext _context;

        public GenericRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task AddAsync(T entity)
        {
            await _context.AddAsync(entity);
        }

        public async Task<IEnumerable<T>> GetAll()
        {
            return await _context.Set<T>().ToListAsync();
        }

        public void Remove(int id)
        {
            _context.Remove(id);
        }

        public async Task Save()
        {
            await _context.SaveChangesAsync();
        }

        public void Update(T entity)
        {
            _context.Update(entity);
        }
    }
}
