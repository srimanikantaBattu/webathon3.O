const exp = require("express");
const outingsApp = exp.Router();
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const e = require("express");
const { ObjectId } = require("mongodb");
require("dotenv").config();

let outingsCollection;

outingsApp.use((req, res, next) => {
    outingsCollection = req.app.get("outingsCollection");
    next();
});

outingsApp.post("/add-outing",
  expressAsyncHandler(async (req, res) => {
    const data = req.body;
    const result = await outingsCollection.insertOne(data);
    res.send({
      success: true,
      data: result})
}))

outingsApp.get("/get-outings",
  expressAsyncHandler(async (req, res) => {
    const outings = await outingsCollection.find().toArray();
    res.send({
      success: true,
      data: outings})
}))

outingsApp.put("/update-outing/:id", expressAsyncHandler(async (req, res) => {
    const id = new ObjectId(req.params.id);
    const result = await outingsCollection.updateOne({ _id: id }, { $set: {status:"approved"}  });
    res.send({
      success: true,
      data: result})
}))

outingsApp.get("/get-outings/:rollno", expressAsyncHandler(async (req, res) => {
    const rollno = req.params.rollno;
    console.log(rollno);
    const outings = await outingsCollection.find({ rollno: rollno }).toArray();
    console.log(outings);
    res.send({
      success: true,
      data: outings})
}))


module.exports = outingsApp;