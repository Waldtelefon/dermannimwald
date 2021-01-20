/**
 *Description of index
 *@author Matti3939
 *@version 1.0
 *@since 13.01.2021
 */

require('dotenv').config();

const express = require('express');
const app = express();

const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose')

mongoose.connect(process.env.DB_LOGIN_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to the MongoDB');
}).catch((err) => {
    console.log(err);
});

let indexRoutes = require("./routes/index");

app

    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}))

    .use(cookieParser())

    .engine("html", require("ejs").renderFile)
    .set("view engine", "ejs")

    .use(express.static(path.join(__dirname, '/public')))

    .set('views', path.join(__dirname, "/views"))

    .use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    }))

    .use(async function (req, res, next) {
        req.user = req.session.user;

        next();
    })

    .use("/", indexRoutes);


app.listen(process.env.PORT, () => {
    console.log(`App now listening on port ${process.env.PORT}`);
});