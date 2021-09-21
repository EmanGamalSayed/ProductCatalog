using Microsoft.AspNetCore.Mvc;
using ProductCategory.Entities;
using ProductCategory.Entities.DTO;
using ProductCategory.Service;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;

namespace ProductCategory.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }
        // GET: api/Product
        [HttpGet]
        public IEnumerable<GetProductDto> GetProducts()
        {
            return _productService.GetAllProducts();
        }

        // GET: api/Product/5
        [HttpGet("{id}")]
        public IActionResult GetProduct(Guid id)
        {
            try
            {
                var product = _productService.GetProduct(id);
                if (product == null)
                {
                    return NotFound();
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error :{ex}");
            }

        }

        

        // POST: api/Product
        [HttpPost]
        public IActionResult PostProduct(ProductDto product)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            try
            {
                _productService.InsertProduct(product);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error :{ex}");
            }
        }

        // PUT: api/Product/5
        [HttpPost]
        [Route("UpdateProduct")]
        public IActionResult PutProduct([FromBody] GetProductDto product)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                _productService.UpdateProduct(product);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error :{ex}");
            }
        }

        // DELETE: api/Product/5
        [HttpGet]
        [Route("DeleteProduct")]
        public IActionResult DeleteProduct(Guid id)
        {
            try
            {
                _productService.DeleteProduct(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error :{ex}");
            }
        }

        [HttpPost, DisableRequestSizeLimit]
        [Route("UploadImage")]
        public IActionResult Upload()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpGet, DisableRequestSizeLimit]
        [Route("getPhotos")]
        public IActionResult GetPhotos()
        {
            try
            {
                var folderName = Path.Combine("Resources", "Images");
                var pathToRead = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                var photos = Directory.EnumerateFiles(pathToRead)
                    .Where(IsAPhotoFile)
                    .Select(fullPath => Path.Combine(folderName, Path.GetFileName(fullPath)));
                return Ok(new { photos });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        private bool IsAPhotoFile(string fileName)
        {
            return fileName.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".png", StringComparison.OrdinalIgnoreCase);
        }
    }

}
