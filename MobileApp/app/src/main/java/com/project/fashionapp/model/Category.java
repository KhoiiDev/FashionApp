package com.project.fashionapp.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Category {
    private String category_id;
    private String category_name;
    private List<String> category_images;
    private String category_description;
    private String datebegin;

    public Category() {
    }

    public Category(String category_id, String category_name, List<String> category_images, String category_description, String datebegin) {
        this.category_id = category_id;
        this.category_name = category_name;
        this.category_images = category_images;
        this.category_description = category_description;
        this.datebegin = datebegin;
    }

    public String getCategoryId() {
        return category_id;
    }

    public void setCategoryId(String category_id) {
        this.category_id = category_id;
    }

    public String getCategoryName() {
        return category_name;
    }

    public void setCategoryName(String category_name) {
        this.category_name = category_name;
    }

    public List<String> getCategoryImages() {
        return category_images;
    }

    public void setCategoryImages(List<String> category_images) {
        this.category_images = category_images;
    }

    public String getCategoryDescription() {
        return category_description;
    }

    public void setCategoryDescription(String category_description) {
        this.category_description = category_description;
    }

    public String getDateBegin() {
        return datebegin;
    }

    public void setDateBegin(String datebegin) {
        this.datebegin = datebegin;
    }

    public Map<String, Object> toMap() {
        HashMap<String, Object> result = new HashMap<>();
        result.put("category_id", category_id);
        result.put("category_name", category_name);
        result.put("category_images", category_images);
        result.put("category_description", category_description);
        result.put("datebegin", datebegin);
        return result;
    }

    public static Category fromMap(Map<String, Object> map) {
        Category category = new Category();
        category.setCategoryId((String) map.get("category_id"));
        category.setCategoryName((String) map.get("category_name"));
        category.setCategoryImages((List<String>) map.get("category_images"));
        category.setCategoryDescription((String) map.get("category_description"));
        category.setDateBegin((String) map.get("datebegin"));
        return category;
    }
}
