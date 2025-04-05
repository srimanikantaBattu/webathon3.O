const exp = require("express");
const userApp = exp.Router();
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

let usersCollection;

userApp.use((req, res, next) => {
  usersCollection = req.app.get("usersCollection");
  next();
});

userApp.post("/register",
  expressAsyncHandler(async (req, res) => {
    const data = req.body.data;
    // console.log(data)
    const result = await usersCollection.insertMany(data);
    res.send({
      success: true,
      data: result})
}))

module.exports = userApp;