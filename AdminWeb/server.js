const express = require("express");
const dotenv = require("dotenv").config(); // config dot env
const hbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const http = require('http');


const session = require('express-session');
const flash = require("connect-flash");


const app = express();
//build express-handlebars
app.set("view engine", "hbs");

app.engine(
    "hbs",
    hbs.engine({
        defaultLayout: "main",
        extname: ".hbs",
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
        },
    })
);


// Đăng ký body-parser trên app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.urlencoded({ extended: false }))
app.use(express.json({ extended: false }))

// register file static files
app.use(express.static(path.join(__dirname, "/public")));

// 
app.use(session({
    secret: 'webadminfashionapp',
    cookie: { maxAge: 60000 },
    saveUninitialized: false,
    resave: false
}));

app.use(flash());

//require routers
const CategoryManager = require("./routers/CategoryManagement");
const BrandsManager = require("./routers/BrandsManagement");

//Routers
app.use("/CategoryManagement", CategoryManager);
app.use("/BrandsManagement", BrandsManager);


app.get('/', (req, res) => {
    res.render('home');
});
app.get('/home', (req, res) => {
    res.render('home');
});


app.use("*", (req, res) => {
    res.render("404", {
        layout: false,
    });
});

app.listen(process.env.PORT, () => {
    console.log("Server is running on port http://localhost:" + process.env.PORT);
});
