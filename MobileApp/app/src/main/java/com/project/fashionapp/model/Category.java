package com.project.fashionapp.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Category {
    private String categoryId;
    private String categoryName;
    private String categoryImages;
    private String categoryDescription;
    private String LastModified;

    public Category() {
    }

    public Category(String categoryId, String categoryName, String categoryImages, String categoryDescription, String lastModified) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.categoryImages = categoryImages;
        this.categoryDescription = categoryDescription;
        LastModified = lastModified;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getCategoryImages() {
        return categoryImages;
    }

    public void setCategoryImages(String categoryImages) {
        this.categoryImages = categoryImages;
    }

    public String getCategoryDescription() {
        return categoryDescription;
    }

    public void setCategoryDescription(String categoryDescription) {
        this.categoryDescription = categoryDescription;
    }

    public String getLastModified() {
        return LastModified;
    }

    public void setLastModified(String lastModified) {
        LastModified = lastModified;
    }
}
