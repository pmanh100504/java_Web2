package com.vanmanh.example05.payloads;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    private Long productId;

    private String productName;

    private String image;

    private String description;

    private Integer quantity;

    private Double price;

    private Double discount;

    private Double specialPrice;

    // Include category info so frontend can show category.categoryName
    private CategoryDTO category;

}
