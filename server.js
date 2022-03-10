import express from "express";
import { engine } from "express-handlebars";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import path from "path";
import ContactModel from "./Model/contact";
const app = express();

// set template engine
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// =================database connecting start here=============
let mongodburl = "mongodb://localhost:27017/student";
mongoose.connect(mongodburl, err => {
  if (err) throw err;
  console.log("database connected");
});
// =================database end here==================

/*=======middleware block==============*/
app.use(express.static(path.join(__dirname, "public")));
// body parser
app.use(express.urlencoded({ extended: "true" })); //it is very important if not use it gives empty data (extended :false => it takes only string)

/*=======middleware block==============*/

// !========Post methos starts here====/*
app.post("/contacts", async (req, res) => {
  // res.send("hey everything is in headache now ");
  //   console.log(req.body);
  // let { firstname, lastname, email, number } = req.body;
  // console.log(firstname);
  let payload = req.body;
  // =====node mailer block====
  nodemailer
    .createTransport({
      service: "gmail",
      auth: {
        user: "manihoogar328@gmail.com",
        pass: "manijhansi@3",
      },
    })
    .sendMail({
      from: "manihoogar328@gmail.com",
      to: [req.body.email, "priyanka.km@testyantra.com"],
      subject: "contact form",
      html: `<h1>${req.body.firstname}+ ${req.body.lastname}</h1>
      <p>Email:${req.body.email}</p>
      <p>Phone:${req.body.number}</p>
      <p>Comments:${req.body.description}</p>`,
    });
  let data = await ContactModel.create(payload);
  res.send({ data, text: "successfully created" });
});
// !========Post methos ends here====/*

// routing
app.get("/", (req, res) => {
  res.render("home", { title: "welcome to nodejs world" });
});
app.get("/contact", (req, res) => {
  res.render("contact", { title: "contact us" });
});

app.get("/assignment", (req, res) => {
  res.render("assignment", { title: "contact us" });
});

// getting data from the database using find() of mongoose
// lean() is used cover json to object
// display the data in the UI
app.get("/students", async (req, res) => {
  let data = await ContactModel.find({}).lean();
  res.render("students", { data });
});

// listen
app.listen(5000, err => {
  if (err) throw err;
  console.log("server is running in port number 5000");
});
