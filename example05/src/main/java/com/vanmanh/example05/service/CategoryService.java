package com.vanmanh.example05.service;

import com.vanmanh.example05.entity.Category;
import com.vanmanh.example05.payloads.CategoryDTO;
import com.vanmanh.example05.payloads.CategoryResponse;

public interface CategoryService {
    
    CategoryDTO createCategory(Category category);
    CategoryResponse getCategories(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
    CategoryDTO updateCategory(Category category, Long categoryId);
    String deleteCategory(Long categoryId);
    CategoryDTO getCategoryById(Long categoryId);
}
