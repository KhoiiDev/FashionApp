package com.project.fashionapp.model;

public class Sizes {

    public class Size {
        private String size_id;
        private String size_name;
        private Category category;

        public Size() {}

        public Size(String size_id, String size_name, Category category) {
            this.size_id = size_id;
            this.size_name = size_name;
            this.category = category;
        }

        public String getSizeId() {
            return size_id;
        }

        public void setSizeId(String size_id) {
            this.size_id = size_id;
        }

        public String getSizeName() {
            return size_name;
        }

        public void setSizeName(String size_name) {
            this.size_name = size_name;
        }

        public Category getCategory() {
            return category;
        }

        public void setCategory(Category category) {
            this.category = category;
        }
    }
}
