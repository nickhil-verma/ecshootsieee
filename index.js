const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// Basic Plant Schema and Model (/plants route)
const plantSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  temperature: { type: String, required: true },
  soilMoisture: { type: String, required: true },
  humidity: { type: String, required: true },
  harvestingTimePeriod: { type: String, required: true }
});



const Plant = mongoose.model("Plant", plantSchema);

// Real-Time Plant Schema and Model (/plants/RealTimeDetail route)
const realTimePlantSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  temperature: { type: String, required: true },
  soilMoisture: { type: String, required: true },
  humidity: { type: String, required: true },
  dateOfSowing: { type: Date, required: true },
  harvestingTimePeriod: { type: Number, required: true }, // In days
});

const RealTimePlant = mongoose.model("RealTimePlant", realTimePlantSchema);

// Root Route
app.get("/", (req, res) => res.send("Welcome to the Plant API!"));

// Basic Plant CRUD Operations
app.get("/plants", async (req, res) => {
  try {
    const plants = await Plant.find();
    res.status(200).json(plants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/plants", async (req, res) => {
  console.log(req.body); // Debug log

  try {
    const plants = req.body;
    if (!Array.isArray(plants) || plants.length === 0) {
      return res.status(400).json({ error: "Invalid or empty plant data" });
    }
    
    const result = await Plant.insertMany(plants, { ordered: false });
    res.status(201).json({ message: "Plants added successfully", result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// Add New Real-Time Plant
app.post("/plants/RealTimeDetail", async (req, res) => {
  try {
    const { name, dateOfSowing, harvestingTimePeriod } = req.body;

    // Try parsing the date as a valid date string
    const sowingDate = new Date(dateOfSowing);
    if (isNaN(sowingDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format for dateOfSowing. Ensure it's in the correct format." });
    }

    const existingPlant = await RealTimePlant.findOne({ name });

    if (existingPlant) {
      return res.status(400).json({ error: "Plant already exists in real-time tracking." });
    }

    const realTimePlant = new RealTimePlant({ ...req.body, dateOfSowing: sowingDate });
    await realTimePlant.save();
    res.status(201).json({ message: "Real-time plant added successfully", realTimePlant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Get Real-Time Plants
app.get("/plants/RealTimeDetail", async (req, res) => {
  try {
    const plants = await RealTimePlant.find();
    res.status(200).json(plants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Periodic Removal of Matured Plants
setInterval(async () => {
  try {
    const plants = await RealTimePlant.find();
    const now = new Date();

    for (const plant of plants) {
      const sowingDate = new Date(plant.dateOfSowing);
      const harvestDate = new Date(sowingDate);
      harvestDate.setDate(harvestDate.getDate() + plant.harvestingTimePeriod);

      if (now >= harvestDate) {
        await RealTimePlant.deleteOne({ _id: plant._id });
        console.log(`Removed matured plant: ${plant.name}`);
      }
    }
  } catch (err) {
    console.error("Error removing matured plants:", err);
  }
}, 60000); // Runs every 60 seconds

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
