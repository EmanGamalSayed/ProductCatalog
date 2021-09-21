using System;
using System.Collections.Generic;
using System.Text;

namespace ProductCategory.Entities.DTO
{
    public class GetProductDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Photo { get; set; }
        public decimal Price { get; set; }
        public DateTime? LastUpdated { get; set; }
    }
    public class ProductDto
    {
        public string Name { get; set; }
        public string Photo { get; set; }
        public decimal Price { get; set; }
    }
}
