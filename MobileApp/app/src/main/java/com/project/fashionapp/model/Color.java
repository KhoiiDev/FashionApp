package com.project.fashionapp.model;

public class Color {

    String color_id, color_name, category_id;

    public Color() {
    }

    public Color(String color_id,  String category_id,String color_name) {
        this.color_id = color_id;
        this.color_name = color_name;
        this.category_id = category_id;
    }

    public String getColor_id() {
        return color_id;
    }

    public void setColor_id(String color_id) {
        this.color_id = color_id;
    }

    public String getColor_name() {
        return color_name;
    }

    public void setColor_name(String color_name) {
        this.color_name = color_name;
    }

    public String getCategory_id() {
        return category_id;
    }

    public void setCategory_id(String category_id) {
        this.category_id = category_id;
    }
}
