class Size {
    constructor(sizeId, sizeName, category) {
        this.sizeId = sizeId;
        this.sizeName = sizeName;
        this.category = category;
    }

    toObject() {
        return {
            size_id: this.sizeId,
            size_name: this.sizeName,
            category: this.category.toObject()
        };
    }
}

module.exports = Size;