const exp = require("express");
const userApp = exp.Router();
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const e = require("express");
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

userApp.get("/get-users",
  expressAsyncHandler(async (req, res) => {
    const users = await usersCollection.find().toArray();
    res.send({
      success: true,
      data: users
    })
  }))

userApp.post("/login",
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password" });
    }
    const isPasswordValid = password === user.email.slice(0, 10);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid email or password" });
    }
    return res.send({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        startyear: user.startyear,
        rollno: user.rollno,
        mobile: user.mobile,
        fathername: user.fathername,
        father_mobile: user.father_mobile,
        room_no: user.room_no,
        branch: user.branch,
        // role: user.role,
        // id: user._id.toString(),
      },
    });
  }))

module.exports = userApp;