const exp = require("express");
const paymentsApp = exp.Router();
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
require("dotenv").config();

let paymentsCollection;
let usersCollection

paymentsApp.use((req, res, next) => {
    paymentsCollection = req.app.get("paymentsCollection");
    usersCollection = req.app.get("usersCollection");
    next();
});

paymentsApp.post("/add-payment",
  expressAsyncHandler(async (req, res) => {
    const data = req.body.data;
    const result = await paymentsCollection.insertMany(data);
    res.send({
      success: true,
      data: result})
}))

paymentsApp.post("/get-payments",expressAsyncHandler(async (req, res) => {
    const email = req.body.email;
    const year = req.body.year;
    const payments = await paymentsCollection.findOne({year: year});
    const sem1payments = payments.sem1payments;
    const sem2payments = payments.sem2payments;
    let sem1paid = false;
    let sem2paid = false;
    for(const payment of sem1payments){
        if(payment.email === email){
            sem1paid = true;
            break;
        }
    }
    for(const payment of sem2payments){
        if(payment.email === email){
            sem2paid = true;
            break;
        }
    }
    res.send({
      success: true,
      data: {
        sem1paid: sem1paid,
        sem2paid: sem2paid,
        semester1DueDate: payments.semester1DueDate,
        semester2DueDate: payments.semester2DueDate
      }})
}))

// sending emails for the due people
// paymentsApp.get("/send-emails",expressAsyncHandler(async (req, res) => {
//     const users = await usersCollection.find().toArray();
//     const payments = await paymentsCollection.find().toArray();
// }))

module.exports = paymentsApp;
