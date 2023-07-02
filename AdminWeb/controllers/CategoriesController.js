const Category = require('../models/Category');
const { db, bucket } = require("../config/FirebaseConnect");
const moment = require('moment');
const categoryRef = db.ref('CategoryData');
const url = require('url');
const slugify = require('string-slugify');
const transliteration = require('transliteration');
const { async } = require('hasha');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require("path");

const controller = {
    getCategories: async (req, res) => {
        try {
            const snapshot = await categoryRef.once('value');
            let data = snapshot.val();
            res.contentType('text/html')
                .render("CategoryIndex", {
                    data,
                    layout: "main",
                });
        } catch (error) {
            console.log(error);
            res.status(500)
                .contentType('text/html')
                .render("500", {
                    layout: false
                });
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const categoryId = req.body.categoryId;
            const categoryName = req.body.categoryName;

            if (categoryId === '' || categoryName === '') {
                res.status(400).send({
                    reaction: false
                });
                return;
            }

            const snapshot = await categoryRef.child(categoryName).once('value');
            const category = snapshot.val();

            if (category) {
                const fileName = decodeURIComponent(url.parse(category.categoryImages.toString()).pathname).split('/').pop();
                const fileRef = bucket.file(`Category/${fileName}`);
                const [fileExists] = await fileRef.exists(); // Chờ trả về kết quả exists()
                if (fileExists) await fileRef.delete();  // Chờ trả về kết quả xóa file
                await categoryRef.child(categoryName).remove() // Chờ trả về kết quả xóa category
                res.send({
                    reaction: true
                });
            } else {
                res.status(404).render("404", {
                    layout: false
                });
                return;
            }
        } catch (error) {
            console.log(error);
            res.status(500)
                .contentType('text/html')
                .render("500", {
                    layout: false
                });
        }
    },
    importCategory: async (req, res) => {
        try {
            const acceptFile = [".xls", ".xlsx"];
            if (req.file && acceptFile.includes(path.extname(req.file.originalname))) {

                const filePath = req.file.path; // đường dẫn tạm thời của tệp được tải lên
                const workbook = xlsx.readFile(filePath); // đọc file
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                // workbook.SheetNames[0] là tên của sheet đầu tiên trong tệp Excel.
                // worksheet là một đối tượng đại diện cho sheet được chọn trong tệp Excel
                // Nó được truy cập bằng cách sử dụng tên sheet, và nó chứa các giá trị của các ô trong sheet đó.

                // Tạo mảng các đối tượng từ dữ liệu trong tệp Excel
                const data = xlsx.utils.sheet_to_json(worksheet);
                if (data.length === 0) {
                    res.status(400).send({
                        reaction: false
                    });
                    return;
                }
                else {
                    // let categoryData = [];
                    let arrCategoryName = [];
                    let countCheck = 0;

                    for (let i = 0; i < data.length; i++) {
                        const item = data[i];
                        const isValid = checkInputValue(item.categoryName) && checkInputValue(item.categoryDescription) && checkInputValue(item.categoryImages) && checkInputValue(item.status);
                        const isDuplicate = arrCategoryName.includes(item.categoryName);
                        if (isValid && !isDuplicate) {
                            countCheck += 1;
                            let category = new Category(
                                categoryRef.push().key,
                                item.categoryName,
                                item.categoryDescription,
                                item.categoryImages,
                                new Date().toLocaleString(),
                                [],
                                transliteration.slugify(item.categoryName, { separator: ' ', lowercase: true, trim: true })
                                    .replace(/[^\w\s]/gi, ' ')
                                    .replace(/\s+/g, ' ')
                                    .split(' ')
                                    .filter(word => word !== ''),
                                item.status,
                            );
                            const snapshot = await categoryRef.child(item.categoryName).once('value');
                            if (!snapshot.exists()) {
                                categoryRef.child(item.categoryName).set(category.toObject());
                            }
                            arrCategoryName.push(item.categoryName);
                        }
                    }

                    // Xóa tệp tạm thời
                    fs.unlinkSync(filePath);
                    res.status(200).send({
                        reaction: true
                    });
                }
            } else {
                res.status(400).send({
                    reaction: false,
                    message: "File error"
                });
                return;
            }
        } catch (error) {
            console.log(error);
            res.status(500).contentType('text/html').render("500", {
                layout: false
            });

        }
    },
    exportCategory: async (req, res) => {
        try {
            const snapshot = await categoryRef.once('value');
            const data = snapshot.val();

            // Tạo file Excel từ dữ liệu
            const wb = xlsx.utils.book_new();
            const ws = xlsx.utils.json_to_sheet(Object.values(data));
            xlsx.utils.book_append_sheet(wb, ws, 'Data');
            const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

            // Thiết lập header cho phản hồi
            res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Length', buffer.length);

            // Trả về file Excel
            res.send(buffer);

        } catch (error) {
            console.log(error);
            res.status(500).contentType('text/html').render("500", {
                layout: false
            });

        }
    },
    addCategory: async (req, res) => {
        try {
            const { categoryName, categoryDescription, categoryImageUrl } = req.body;
            const urlImage = categoryImageUrl || (req.file && (await uploadFile(req.file, "a")));

            if (!checkInputValue(categoryName) || !checkInputValue(categoryDescription) || !checkInputValue(urlImage)) {
                res.status(400).send({
                    reaction: false
                });
                return;
            };

            const snapshot = await categoryRef
                .orderByChild("categoryName")
                .equalTo(categoryName)
                .once("value");
            const checkValidation = snapshot.exists();

            if (checkValidation) {
                res.status(400).send({
                    exists: checkValidation,
                    reaction: false
                });
                console.log("Category đã tồn tại");
                return;
            }
            const categoryId = categoryRef.push().key;
            const LastModified = new Date().toLocaleString();
            const categorySlug = transliteration.slugify(categoryName, { separator: ' ', lowercase: true, trim: true })
                .replace(/[^\w\s]/gi, ' ')
                .replace(/\s+/g, ' ')
                .split(' ')
                .filter(word => word !== '');
            const Brands = [];
            const status = "ACTIVE";

            const category = new Category(
                categoryId,
                categoryName,
                categoryDescription,
                urlImage,
                LastModified,
                Brands,
                categorySlug,
                status,
            );
            const categoryObj = category.toObject();

            categoryRef.child(categoryName).set(categoryObj);

            res.send({
                categoryObj: categoryObj,
                exists: false,
                reaction: true
            });
        } catch (error) {
            console.log(error);
            res.status(500).contentType('text/html').render("500", {
                layout: false
            });
        }
    },
    updateCategory: async (req, res) => {
        try {
            const { categoryID, editCategoryName, editCategoryDescription, oldName } = req.body;

            if (!checkInputValue(categoryID) || !checkInputValue(editCategoryName) || !checkInputValue(editCategoryDescription) || !checkInputValue(String(oldName))) {
                res.status(400).send({
                    reaction: false
                });
                return;
            };

            const editImageURL = req.file ? await uploadFile(req.file, req.body.editImageURL) : req.body.editImageURL;
            const Brands = [];
            const status = "ACTIVE";
            const LastModified = new Date().toLocaleString();
            let categoryObj;

            if (String(oldName).trim().toLowerCase().localeCompare(String(editCategoryName).trim().toLowerCase()) !== 0) { // Nếu có thay đổi tên

                // Xóa danh mục cũ
                await categoryRef.child(oldName).remove();

                // thêm danh mục mới
                const category = new Category(
                    categoryID,
                    editCategoryName.trim(),
                    editCategoryDescription.trim(),
                    editImageURL.trim(),
                    LastModified,
                    Brands,
                    transliteration.slugify(editCategoryName, { separator: ' ', lowercase: true, trim: true })
                        .replace(/[^\w\s]/gi, ' ')
                        .replace(/\s+/g, ' ')
                        .split(' ')
                        .filter(word => word !== ''),
                    status,
                );
                categoryObj = category.toObject();
                await categoryRef.child(editCategoryName).set(categoryObj);
            }
            else {
                // cập nhật danh mục theo tên cũ
                const category = new Category(
                    categoryID,
                    String(oldName).trim(),
                    editCategoryDescription.trim(),
                    editImageURL.trim(),
                    LastModified,
                    Brands,
                    transliteration.slugify(String(oldName).trim(), { separator: ' ', lowercase: true, trim: true })
                        .replace(/[^\w\s]/gi, ' ')
                        .replace(/\s+/g, ' ')
                        .split(' ')
                        .filter(word => word !== ''),
                    status,
                );
                categoryObj = category.toObject();
                await categoryRef.child(String(oldName).trim()).update(categoryObj);
            }

            // kiểm tra nếu hoàn thành tất cả các hoạt động thì mới gửi phản hồi
            res.send({
                reaction: true,
                categoryObj: categoryObj
            });
        } catch (error) {
            console.log(error);
            res.status(500)
                .contentType('text/html')
                .render("500",
                    {
                        layout: false
                    });
        }
    },
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
            const fileRef = bucket.file(`Category/${fileNameOld}`);
            const [fileExists] = await fileRef.exists();
            if (fileExists) fileRef.delete();

            // Thêm file mới
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
        }
    });
}

function checkInputValue(value) {
    if (value) {
        return value.trim() !== '' && /[a-z]/i.test(value.trim());
    }
    return false;
}