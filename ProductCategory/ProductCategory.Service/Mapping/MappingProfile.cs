using AutoMapper;
using ProductCategory.Entities;
using ProductCategory.Entities.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProductCategory.Service.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<ProductDto, Product>();
            CreateMap<Product, GetProductDto>().ReverseMap();

        }
    }
}
