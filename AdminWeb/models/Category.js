class Category {
    constructor(categoryId, categoryName, categoryDescription, categoryImages, LastModified) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.categoryDescription = categoryDescription;
        this.categoryImages = categoryImages;
        this.LastModified = LastModified;
    }

    toObject() {
        return {
            categoryId: this.categoryId,
            categoryName: this.categoryName,
            categoryDescription: this.categoryDescription,
            categoryImages: this.categoryImages,
            LastModified: this.LastModified
        };
    }
}

module.exports = Category;