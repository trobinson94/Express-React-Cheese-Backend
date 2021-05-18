///////////////////////////////
// DEPENDENCIES
////////////////////////////////\
require("dotenv").config();
const { PORT = 3000, MONGODB_URL } = process.env;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  // Connection Events
  mongoose.connection
    .on("open", () => console.log("Your are connected to mongoose"))
    .on("close", () => console.log("Your are disconnected from mongoose"))
    .on("error", (error) => console.log(error));  

///////////////////////////////
// MODELS
////////////////////////////////
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
  });
  
const Cheese = mongoose.model("Cheese", CheeseSchema);
  
///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors()); 
app.use(morgan("dev")); 
app.use(express.json()); 
  

///////////////////////////////
// ROUTES
////////////////////////////////
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Cheese Index Route
app.get("/cheese", async (req, res) => {
    try {
        res.json(await Cheese.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
})

// Cheese CREATE Route
app.post("/cheese", async (req, res) => {
    try {
        res.json(await Cheese.create(req.body));
    } catch (error) {
        res.status(400).json(error);
    }
})

// Cheese UPDATE Route
app.put("/cheese/:id", async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true }));
    } catch (error) {
        res.status(400).json(error);
    }
});

// Cheese DELETE Route
app.delete("/cheese/:id", async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndRemove(req.params.id));
    } catch (error) {
        res.status(400).json(error);
    }
})

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
