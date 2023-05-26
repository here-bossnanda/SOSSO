const express = require('express');
const cors = require('cors');
const indexRouter = require('./routes');
const path = require("path");


const errorHandler = require('./middlewares/errorHandler')
const app = express();

app.use(
    cors({
        origin: "*",
    })
);
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))



app.use(indexRouter);
app.use(errorHandler)

module.exports = app;