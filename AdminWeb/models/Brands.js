// Bảng thương hiệu (Brands):
// brand_id: định danh thương hiệu sản phẩm
// brand_name: tên thương hiệu sản phẩm
// brand_description: mô tả thương hiệu sản phẩm
// brand_trends: thương hiệu được đánh giá cao theo xu hướng
// slug: truy vấn thương hiệu(tự sinh ra cùng với tên thương hiệu).

class Brands {
    constructor(brandsId, categories, brandName, brandDescription, brandTrends, brandSlug, brandURL, LastModified, status) {
        this.brandsId = brandsId;
        this.categories = categories;
        this.brandName = brandName;
        this.brandDescription = brandDescription;
        this.brandTrends = brandTrends;
        this.brandSlug = brandSlug;
        this.brandURL = brandURL;
        this.LastModified = LastModified;
        this.status = status;
    }

    toObject() {
        return {
            brandsId: this.brandsId,
            categories: this.categories,
            brandName: this.brandName,
            brandDescription: this.brandDescription,
            brandTrends: this.brandTrends,
            brandSlug: this.brandSlug,
            brandURL: this.brandURL,
            LastModified: this.LastModified,
            status: this.status,
        };
    }
};

module.exports = Brands;


