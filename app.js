import express from "express";

import router from "./routes/routes.js";

import session from "express-session";

import MongoStore from "connect-mongo";

import bodyParser from "body-parser";

const app = express();
app.use(express.static("public"));
app.use("/node_modules", express.static("node_modules"));
app.use(bodyParser.urlencoded({ extended: true }));

// to use ejs
app.set("view engine", "ejs");

const uri = "mongodb+srv://Shree:12345@cluster0.htevlzz.mongodb.net/DriveTest?retryWrites=true&w=majority&appName=Cluster0";

const session_store = MongoStore.create({
  mongoUrl: uri,
  dbName: "DriveTest",
  collectionName: "drivetest_users",
});
app.use(
  session({
    secret: "A secret key to sign cookies",
    resave: false,
    saveUninitialized: false,
    store: session_store,
  })
);

app.use("/", router);
app.listen(9990, () => {
  console.log("Server is up and running on port 9990");
});
