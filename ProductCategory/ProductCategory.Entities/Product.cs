using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ProductCategory.Entities
{
    public class Product : BaseEntity
    {
        [Required]
        [MaxLength(255)]
        public string Name { get; set; }
        [DefaultValue("")]
        [Url]
        public string Photo { get; set; }
        [Required]
        [DataType(DataType.Currency)]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

    }
}
