const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middleware for Parsing JSON and Form Data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
  
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/connectFormDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB successfully.");
});

// Define the Contact Form Schema
const connectFormSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type:Number, required: true },
  email: { type: String, required: true },
  Message: { type: String },
  inquireFor:{type:String},
  submittedAt: { type: Date, default: Date.now },
});

// Create a Model
const Contact = mongoose.model("Contact", connectFormSchema);

// Define a POST Route for Submitting Form Data
app.post("/Contact", async (req, res) => {
  // console.log("form data received:", req.body); 
  try {
   //console.log("form data received :",req.body)
    const { name,phone, email,Message, inquireFor} = req.body;
    // Validate Input
    if (!name || !phone || !email ) {
      return res.status(400).json({ error: "Some fields are missing." });
    }


    // Create and Save Contact Data
    const newContact = new Contact({ 
      name,
      phone,
      email,
      Message,
      inquireFor
       });
    await newContact.save();

    res.status(201).json({ message: "Form submitted successfully!" });
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for serving the contact form HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the Server
const PORT = 8080;
app.listen(PORT,() => {
    console.log(`The Server is running on port number:${8080}`)});