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

// Schemas
const plantSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  temperature: { type: String, required: true },
  soilMoisture: { type: String, required: true },
  humidity: { type: String, required: true },
  harvestingTimePeriod: { type: String, required: true },
});

const realTimePlantSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  temperature: { type: String, required: true },
  soilMoisture: { type: String, required: true },
  humidity: { type: String, required: true },
  dateOfSowing: { type: Date, required: true },
  harvestingTimePeriod: { type: Number, required: true },
});

const Plant = mongoose.model("Plant", plantSchema);
const RealTimePlant = mongoose.model("RealTimePlant", realTimePlantSchema);

// Root Route
app.get("/", (req, res) => res.send("Welcome to the Plant API!"));

// Fetch Real-Time Plant Data
app.get("/plants/RealTimeDetail", async (req, res) => {
  try {
    const plants = await RealTimePlant.find();
    res.status(200).json(plants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch Ideal Plant Data
app.get("/plants", async (req, res) => {
  try {
    const plants = await Plant.find();
    res.status(200).json(plants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Real-Time Plant Data with Randomized Conditions
app.put("/plants/RealTimeDetail", async (req, res) => {
  try {
    const plants = await RealTimePlant.find();

    for (let plant of plants) {
      const temp = parseFloat(plant.temperature);
      const soilMoisture = parseFloat(plant.soilMoisture);
      const humidity = parseFloat(plant.humidity);

      // Randomize values by ±0.5-1
      const newTemperature = (temp + Math.random() * (1 - 0.5) * (Math.random() < 0.5 ? -1 : 1)).toFixed(1);
      const newSoilMoisture = (soilMoisture + Math.random() * (1 - 0.5) * (Math.random() < 0.5 ? -1 : 1)).toFixed(1);
      const newHumidity = (humidity + Math.random() * (1 - 0.5) * (Math.random() < 0.5 ? -1 : 1)).toFixed(1);

      // Update plant
      await RealTimePlant.findByIdAndUpdate(plant._id, {
        temperature: newTemperature,
        soilMoisture: newSoilMoisture,
        humidity: newHumidity,
      });

      console.log(`Updated plant: ${plant.name}`);
    }
    res.status(200).json({ message: "Plants updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Function to trigger PUT request every 5 seconds
setInterval(async () => {
  try {
    const response = await fetch(`http://localhost:${port}/plants/RealTimeDetail`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      console.log("Real-time data updated successfully");
    }
  } catch (err) {
    console.error("Error updating real-time data:", err);
  }
}, 5000); // 5 seconds interval

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
