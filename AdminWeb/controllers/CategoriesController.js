const Category = require('../models/Category');
const { db, bucket } = require("../config/FirebaseConnect");
const moment = require('moment');
const categoryRef = db.ref('CategoryData');
const url = require('url');

const controller = {
    getCategories: async (req, res) => {
        try {
            const onValueChange = (snapshot) => {
                const data = snapshot.val();
                
                res.contentType('text/html');
                res.render("CategoryView/CategoryIndex", {
                    data,
                    layout: "main",
                });
            };

            categoryRef.once('value', onValueChange);
        } catch (err) {
            res.status(500);
        }
    },
    deleteCategory: async (req, res) => {
        const id = req.params.id;
        try {
            const snapshot = await categoryRef.child(id).once('value');
            const category = snapshot.val();

            if (category) {
                const fileName = decodeURIComponent(url.parse(category.categoryImages.toString()).pathname).split('/').pop();
                const fileRef = bucket.file(`Category/${fileName}`);
                const [fileExists] = await fileRef.exists();
                if (fileExists) {
                    await fileRef.delete();
                    console.log('File đã được xóa thành công!');
                } else {
                    console.log('File không tồn tại!');
                }
                await categoryRef.child(id).remove();
                console.log('Category đã được xóa thành công!');
                res.sendStatus(200);
            } else {
                console.log('Category không tồn tại!');
                res.sendStatus(404);
            }
        } catch (error) {
            console.error('Lỗi khi xóa category: ', error);
            res.sendStatus(500);
        }
    },

    addCategory: async (req, res) => {
        try {
            const { categoryName, categoryDescription, categoryImageUrl } = req.body;

            const snapshot = await categoryRef
                .orderByChild("categoryName")
                .equalTo(categoryName)
                .once("value");
            const checkValidation = snapshot.exists();

            if (checkValidation) {
                res.send({ exists: checkValidation });
                console.log("Category đã tồn tại");
                return;
            }

            const urlImage =
                categoryImageUrl || (req.file && (await uploadFile(req.file)));

            if (!urlImage) {
                res.status(404).send("Category not found");
                return;
            }

            const categoryId = categoryRef.push().key;
            const LastModified = new Date().toLocaleString();

            const category = new Category(
                categoryId,
                categoryName,
                categoryDescription,
                urlImage,
                LastModified
            );
            const categoryObj = category.toObject();

            categoryRef.child(categoryId).set(categoryObj);

            console.log("Thêm danh mục mới thành công");
            res.send(categoryObj);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },

    updateCategory: async (req, res) => {
        try {
            const { categoryID, editCategoryName, editCategoryDescription } = req.body;
            const editImageURL = req.file ? await uploadFile(req.file) : req.body.editImageURL;

            const LastModified = new Date().toLocaleString();
            const category = new Category(categoryID, editCategoryName, editCategoryDescription, editImageURL, LastModified);
            const categoryObj = category.toObject();

            await categoryRef.child(categoryID).update(categoryObj);

            if (req.file) {
                const fileNameDel = decodeURIComponent(url.parse(req.body.editImageURL).pathname).split('/').pop();
                const fileRef = bucket.file(`Category/${fileNameDel}`);
                const [fileExists] = await fileRef.exists();
                if (fileExists) {
                    await fileRef.delete();
                    console.log('File đã được xóa thành công!');
                } else {
                    console.log('File không tồn tại!');
                }
            }

            res.send(categoryObj);
            console.log('Category đã cập nhật thành công');
        } catch (error) {
            console.log(error);
        }
    },
}

module.exports = controller;

function uploadFile(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error("Category not found"));
            return;
        }
        const date = new Date();
        const fileName = `${date.getTime()}-${file.originalname}`;

        const storageFile = bucket.file(`Category/${fileName}`);
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
    });
}