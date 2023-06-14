const Category = require('../models/Category');
const { db, bucket } = require("../config/FirebaseConnect");
const moment = require('moment');
const categoryRef = db.ref('CategoryData');
const url = require('url');

const controller = {
    getCategories: async (req, res) => {
        try {
            const onValueChange = (snapshot) => {
                const data = [];
                snapshot.forEach((childSnapshot) => {
                    const childData = childSnapshot.val();
                    data.push(childData);
                });
                data.sort((a, b) => {
                    const dateA = new Date(a.LastModified);
                    const dateB = new Date(b.LastModified);
                    return dateB.getTime() - dateA.getTime();
                });
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

    addCategory: async (req, res) => {
        try {
            const { categoryName, categoryDescription, categoryImageUrl } = req.body;

            const snapshot = await categoryRef.orderByChild("categoryName").equalTo(categoryName).once("value");
            const checkValidation = snapshot.exists();

            if (checkValidation) {
                res.send({ exists: checkValidation });
            } else {
                let urlImage = "";

                const DateNow = new Date();
                const day = DateNow.getDate();
                const month = DateNow.getMonth() + 1; // Tháng được đếm từ 0 đến 11, nên cần cộng thêm 1 để lấy giá trị thực tế
                const year = DateNow.getFullYear();
                const hours = DateNow.getHours();
                const minutes = DateNow.getMinutes();
                const seconds = DateNow.getSeconds();

                if (categoryImageUrl) {
                    urlImage = categoryImageUrl;
                } else {
                    try {
                        if (!req.file) {
                            return res.status(404).send("Category not found");
                        }

                        // console.log(req.file);

                        const date = new Date();
                        const fileName = `${date.getTime()}-${req.file.originalname}`;

                        const storageFile = bucket.file(`Category/${fileName}`);
                        const stream = storageFile.createWriteStream({
                            metadata: {
                                contentType: req.file.mimetype
                            }
                        });
                        stream.end(req.file.buffer);
                        date.setFullYear(date.getFullYear() + 3);

                        console.log(date);
                        urlImage = await storageFile.getSignedUrl({
                            action: 'read',
                            expires: date,
                        });
                    } catch (error) {
                        console.log(error);
                        return res.status(500).send("Internal Server Error");
                    }
                }


                const categoryId = categoryRef.push().key;
                const LastModified = `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;

                const category = new Category(categoryId, categoryName, categoryDescription, urlImage, LastModified);
                const categoryObj = category.toObject();

                categoryRef.child(categoryId).set(categoryObj)
                    .then(() => {
                        res.send(categoryObj);
                    })
                    .catch(() => {
                        res.redirect('/ProductManager/category');
                    });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },

    deleteCategory: async (req, res) => {
        const id = req.params.id;
        try {
            const categoryChildRef = categoryRef.child(id);
            // Lấy dữ liệu của category
            const snapshot = await categoryChildRef.once('value');
            const category = snapshot.val();
            if (category) {
                // Xóa file ảnh của category
                const fileName = decodeURIComponent(url.parse(category.categoryImages.toString()).pathname).split('/').pop();
                const fileRef = bucket.file("Category/" + fileName);
                const [fileExists] = await fileRef.exists();
                if (fileExists) {
                    await fileRef.delete();
                    console.log('File đã được xóa thành công!');
                } else {
                    console.log('File không tồn tại!');
                }
                // Xóa category
                await categoryChildRef.remove();
                console.log('Category đã được xóa thành công!');
                res.sendStatus(200); // Trả về mã trạng thái 200 OK
            } else {
                console.log('Category không tồn tại!');
                res.sendStatus(404); // Trả về mã trạng thái 404 Not Found nếu category không tồn tại
            }
        } catch (error) {
            console.error('Lỗi khi xóa category: ', error);
            res.sendStatus(500); // Trả về mã trạng thái 500 Internal Server Error nếu có lỗi xảy ra
        }
    },

    getFormUpdateCategory: async (req, res) => {
        try {
            const id = req.params.id;

            categoryRef.child(id).once("value", function (snapshot) {
                var data = snapshot.val();
                res.contentType('text/html');
                res.render("CategoryView/FormEditCategory", {
                    data,
                    layout: "main",
                });
            });
        } catch (error) {
            console.log(error);
        }
    },

    updateCategory: async (req, res) => {
        try {
            const category = req.body;

            // console.log(category);
            console.log(req);

            const urlImage = "";

            // if (URL || req.file) {
            //     if (URL) {
            //         urlImage = URL;
            //     }
            //     // Kiểm tra xem có file được gửi trong yêu cầu không
            //     else if (req.file) {
            //         try {
            //             // Tạo tên file mới
            //             const date = new Date();
            //             const fileName = date.getTime() + '-' + req.file.originalname;

            //             // Uploadfile lên Firebase Storage
            //             const file = bucket.file("Category/" + fileName);
            //             const stream = file.createWriteStream({
            //                 metadata: {
            //                     contentType: req.file.mimetype
            //                 }
            //             });
            //             stream.end(req.file.buffer);

            //             urlImage = await file.getSignedUrl({
            //                 action: 'read',
            //                 expires: '03-17-2025'
            //             });

            //         } catch (error) {
            //             console.log(error);
            //         }
            //     }

            //     // Xóa file ảnh của category
            //     const fileName = decodeURIComponent(url.parse(ImageOriginale.toString()).pathname).split('/').pop();
            //     const fileRef = bucket.file("Category/" + fileName);
            //     const [fileExists] = await fileRef.exists();
            //     if (fileExists) {
            //         await fileRef.delete();
            //         console.log('File đã được xóa thành công!');
            //     } else {
            //         console.log('File không tồn tại!');
            //     }
            // }

            // else {
            //     urlImage = ImageOriginale;
            // }

            // const DateNow = new Date();
            // const day = DateNow.getDate();
            // const month = DateNow.getMonth() + 1; // Tháng được đếm từ 0 đến 11, nên cần cộng thêm 1 để lấy giá trị thực tế
            // const year = DateNow.getFullYear();
            // const hours = DateNow.getHours();
            // const minutes = DateNow.getMinutes();
            // const seconds = DateNow.getSeconds();
            // const LastModified = `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
            // const category = new Category(categoryId, categoryName, categoryDescription, urlImage, LastModified);
            // const categoryObj = category.toObject();

            // categoryRef.child(categoryId).update(categoryObj)
            //     .then(() => {
            //         res.redirect('/ProductManager/category');
            //     })
            //     .catch(err => console.error(err));
        } catch (error) {
            console.log(error);
        }
    },
}

module.exports = controller;