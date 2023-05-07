const express = require("express");
const app = express();
const fs = require('fs')
const morgan = require('morgan')
const path = require('path')



const userRoute = require("./routes/userRoute");

const bodyParser = require("body-parser");

const cors = require("cors");

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })


// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))


app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


app.use("/user", userRoute);

module.exports = app;
