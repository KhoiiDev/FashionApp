const Brands = require('../models/Brands');
const { db, bucket } = require("../config/FirebaseConnect");
const moment = require('moment');
const brandsRef = db.ref('BrandData');
const categoryRef = db.ref('CategoryData');
const url = require('url');
const slugify = require('string-slugify');
const transliteration = require('transliteration');
const { async } = require('hasha');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require("path");


const controller = {

    getBrands: async (req, res) => {
        try {
            const snapshotCategory = await categoryRef.once('value');
            let categories = snapshotCategory.val();
            const snapshotBrand = await brandsRef.once('value');
            let brands = snapshotBrand.val();

            if (categories && brands) {
                res.contentType('text/html')
                    .render("BrandsView", {
                        categories,
                        brands,
                        layout: "main",
                    });
            }
            else {
                res.status(404).render("404", {
                    layout: false
                });
            }

        } catch (error) {
            console.log(error);
            res.status(500).render("500", {
                layout: false
            });
        }
    },

    importBrands: async (req, res) => {
        try {
            const acceptFile = [".xls", ".xlsx"];


            // if (req.file && acceptFile.includes(path.extname(req.file.originalname))) {
            //     const filePath = req.file.path; // đường dẫn tạm thời của tệp được tải lên
            //     const workbook = xlsx.readFile(filePath); // đọc file
            //     const worksheet = workbook.Sheets[workbook.SheetNames[0]];

            //     const data = xlsx.utils.sheet_to_json(worksheet);
            //     data.forEach(async function (element) {
            //         if (element.brandName && element.brandDescription && element.brandURL && element.status) {
            //             let brandTrends = element.brandTrends || 1;
            //             let brand = new Brands(
            //                 brandsRef.push().key,
            //                 [],
            //                 element.brandName,
            //                 element.brandDescription,
            //                 brandTrends,
            //                 transliteration.slugify(element.categoryName, { separator: ' ', lowercase: true, trim: true })
            //                     .replace(/[^\w\s]/gi, ' ')
            //                     .replace(/\s+/g, ' ')
            //                     .split(' ')
            //                     .filter(word => word !== ''),
            //                 element.brandURL,
            //                 new Date().toLocaleString(),
            //                 element.status
            //             )
            //             let snapshotBrands = await brandsRef.child(element.brandName).once('value');
            //             if (!snapshotBrands.exists()) {
            //                 brandsRef.child(element.brandName).set(brand.toObject());
            //             }

            //         }
            //     });

            // }
            // else {
            //     res.status(400).send({
            //         reaction: false,
            //         message: "File error"
            //     });
            // }
        } catch (error) {
            console.log(error);
            res.status(500).render("500", {
                layout: false
            });
        }
    },
    newBrand: async (req, res) => {
        try {
            const { brandName, imageURL, brandDescription, inCategory } = req.body;
            const urlImage = imageURL || (req.file && (await uploadFile(req.file, "a")));

            if (brandName && urlImage && brandDescription && inCategory.length > 0) {
                const snapshotBrands = await brandsRef.child(brandName).once('value');

                if (snapshotBrands.exists()) {
                    res.send({
                        reaction: false
                    });
                } else {

                    const inCategoryJSON = JSON.parse(inCategory);

                    const brand = new Brands(
                        brandsRef.push().key,
                        inCategoryJSON,
                        brandName,
                        brandDescription,
                        1,
                        transliteration.slugify(brandName, { separator: ' ', lowercase: true, trim: true })
                            .replace(/[^\w\s]/gi, ' ')
                            .replace(/\s+/g, ' ')
                            .split(' ')
                            .filter(word => word !== ''),
                        urlImage,
                        new Date().toLocaleString(),
                        "ACTIVE"
                    );
                    brandsRef.child(brandName).set(brand.toObject());
                    res.send({
                        reaction: true,
                        brand: brand.toObject()
                    });
                }
            } else {
                res.status(400).send({
                    reaction: false
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).render("500", {
                layout: false
            });
        }

    },
    deleteBrand: async (req, res) => {

    },
    updateBrand: async (req, res) => {

    }
}
module.exports = controller;


async function uploadFile(file, oldName) {
    return new Promise(async (resolve, reject) => {
        if (!file) {
            reject(new Error("File not found"));
            return;
        } else {
            // Xóa file cũ
            const fileNameOld = decodeURIComponent(url.parse(oldName.toString()).pathname).split('/').pop();
            if (fileNameOld !== "image default.jpg") {
                const fileRef = bucket.file(`Brands/${fileNameOld}`);
                const [fileExists] = await fileRef.exists();
                if (fileExists) fileRef.delete();
            }

            // Thêm file mới
            const date = new Date();
            const fileName = `${date.getTime()}-${file.originalname}`;

            const storageFile = bucket.file(`Brands/${fileName}`);
            const stream = storageFile.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                },
            });
            stream.on("error", (error) => {
                reject(error);
            });
            stream.on("finish", async () => {
                date.setFullYear(date.getFullYear() + 3);

                const urlImage = await storageFile.getSignedUrl({
                    action: "read",
                    expires: date,
                });
                resolve(urlImage[0]);
            });
            stream.end(file.buffer);
        }
    });
}


