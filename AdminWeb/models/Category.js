class Category {
    constructor(categoryId, categoryName, categoryDescription, categoryImages, LastModified, Brands, categorySlug, status) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.categoryDescription = categoryDescription;
        this.categoryImages = categoryImages;
        this.LastModified = LastModified;
        this.categorySlug = categorySlug
        this.Brands = Brands;
        this.status = status;
    }

    toObject() {
        return {
            categoryId: this.categoryId,
            categoryName: this.categoryName,
            categoryDescription: this.categoryDescription,
            categoryImages: this.categoryImages,
            LastModified: this.LastModified,
            Brands: this.Brands,
            status: this.status,
            categorySlug: this.categorySlug,
        };
    }
}

module.exports = Category;