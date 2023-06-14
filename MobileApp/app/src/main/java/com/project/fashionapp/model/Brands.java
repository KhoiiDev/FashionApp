package com.project.fashionapp.model;

public class Brands {

    String brand_id, brand_name, brand_description, brand_img;

    public Brands() {
    }

    public Brands(String brand_id, String brand_name, String brand_description, String brand_img) {
        this.brand_id = brand_id;
        this.brand_name = brand_name;
        this.brand_description = brand_description;
        this.brand_img = brand_img;
    }

    public String getBrand_id() {
        return brand_id;
    }

    public void setBrand_id(String brand_id) {
        this.brand_id = brand_id;
    }

    public String getBrand_name() {
        return brand_name;
    }

    public void setBrand_name(String brand_name) {
        this.brand_name = brand_name;
    }

    public String getBrand_description() {
        return brand_description;
    }

    public void setBrand_description(String brand_description) {
        this.brand_description = brand_description;
    }

    public String getBrand_img() {
        return brand_img;
    }

    public void setBrand_img(String brand_img) {
        this.brand_img = brand_img;
    }
}
