using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Floosy_Platform_BLL.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAll();
        Task AddAsync(T entity);
        void Update(T entity);
        void Remove(T entity);
        Task Save();

    }
}
