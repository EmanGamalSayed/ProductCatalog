using AutoMapper;
using ProductCategory.Entities;
using ProductCategory.Entities.DTO;
using ProductCategory.Repo;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace ProductCategory.Service
{
    public class ProductService : IProductService
    {
        private IRepository<Product> _productRepository;
        private readonly IMapper _mapper;

        public ProductService(IRepository<Product> ProductRepository, IMapper mapper)
        {
            this._productRepository = ProductRepository;
            _mapper = mapper;
        }

        public IEnumerable<GetProductDto> GetAllProducts()
        {
            var results =  _productRepository.GetAll();
            return _mapper.Map<IEnumerable<Product>, IEnumerable<GetProductDto>>(results);
        }

        public Product GetProduct(Guid id)
        {
            return _productRepository.Get(id);
        }

        public void InsertProduct(ProductDto Product)
        {
            var data = _mapper.Map<ProductDto, Product>(Product);
            //if(data.Photo == null)
            //    data.Photo = "default.jpg";
            data.LastUpdated = DateTime.UtcNow;
            _productRepository.Insert(data);

        }
        public void UpdateProduct(GetProductDto Product)
        {
            var data = _mapper.Map<GetProductDto, Product>(Product);
            data.LastUpdated = DateTime.UtcNow;
            _productRepository.Update(data);
            
        }

        public void DeleteProduct(Guid id)
        {
            Product product = GetProduct(id);
            _productRepository.Remove(product);
            _productRepository.SaveChanges();
        }
    }
}
