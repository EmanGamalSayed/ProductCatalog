using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductCategory.Entities;
using ProductCategory.Repo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace ProductCategory.API.Controllers
{
    public class ProductController : ApiController
    {
        private readonly IRepository<Product> _productRepository;

        public ProductController(IRepository<Product> productRepository)
        {
            _productRepository = productRepository;
        }
        // GET: api/Product
        public IEnumerable<Product> GetProducts()
        {
            return _productRepository.GetAll();
        }

        // GET: api/Product/5
        [ResponseType(typeof(Product))]
        public IHttpActionResult GetProduct(Guid id)
        {
            var product = _productRepository.Get(id);
            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        // PUT: api/Product/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutProduct(Guid id, Product product)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (id != product.Id)
                return BadRequest();

            product.LastUpdated = DateTime.UtcNow;

            _productRepository.Update(product);

            try
            {
                _productRepository.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                //if (!ProductExists(id))
                //{
                //return NotFound();
                //}

                //throw;
                return StatusCode(HttpStatusCode.NoContent);

            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Product
        [ResponseType(typeof(Product))]
        public IHttpActionResult PostProduct(Product product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            product.Photo = "default.jpg";
            product.LastUpdated = DateTime.UtcNow;

            _productRepository.Insert(product);
            _productRepository.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = product.Id }, product);
        }

        // DELETE: api/Product/5
        [ResponseType(typeof(Product))]
        public IHttpActionResult DeleteProduct(Guid id)
        {
            Product product = _productRepository.Get(id);
            if (product == null)
            {
                return NotFound();
            }

            _productRepository.Delete(product);
            _productRepository.SaveChanges();

            return Ok(product);
        }
    }
}
