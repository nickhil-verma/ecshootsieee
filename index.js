const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config(); // To load environment variables from a .env file

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  });

// Mongoose Schema and Model
const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  temperature: { type: String, required: true },
  humidity: { type: String, required: true },
  soilMoisture: { type: String, required: true },
  light: {
    blueLight: { type: String, required: true },
    redLight: { type: String, required: true },
    fullSpectrum: { type: String, required: true },
  },
  waterRequirement: { type: String, required: true },
});

const Plant = mongoose.model("Plant", plantSchema);

// Routes

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the Plant API!");
});

// Get All Plants
app.get("/plants", async (req, res) => {
  try {
    const plants = await Plant.find();
    res.status(200).json(plants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add New Plants
app.post("/plants", async (req, res) => {
  try {
    const plants = req.body;

    if (!Array.isArray(plants)) {
      return res.status(400).json({ error: "Request body must be an array of plants." });
    }

    for (const plant of plants) {
      if (
        !plant.name ||
        !plant.temperature ||
        !plant.humidity ||
        !plant.soilMoisture ||
        !plant.waterRequirement ||
        !plant.light?.blueLight ||
        !plant.light?.redLight ||
        !plant.light?.fullSpectrum
      ) {
        return res.status(400).json({ error: "All fields are required for every plant." });
      }
    }

    const newPlants = await Plant.insertMany(plants);
    res.status(201).json({ message: "Plants added successfully", plants: newPlants });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
