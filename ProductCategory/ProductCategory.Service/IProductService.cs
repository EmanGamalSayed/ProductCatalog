using ProductCategory.Entities;
using ProductCategory.Entities.DTO;
using System;
using System.Collections.Generic;

namespace ProductCategory.Service
{
    public interface IProductService
    {
        IEnumerable<GetProductDto> GetAllProducts();
        Product GetProduct(Guid id);
        void InsertProduct(ProductDto product);
        void UpdateProduct(GetProductDto product);
        void DeleteProduct(Guid id);
    }
}
