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
  name: { type: String, required: true, unique: true },
  temperature: { type: String, required: true },
  soilMoisture: { type: String, required: true },
  humidity: { type: String, required: true },
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add New Plants (Batch addition)
app.post("/plants", async (req, res) => {
  try {
    const plants = req.body;

    // Validate each plant in the array
    for (const plant of plants) {
      const { name, temperature, soilMoisture, humidity } = plant;

      // Ensure all fields are present and not empty
      if (
        !name || !temperature || !soilMoisture || !humidity || 
        name.trim() === "" || temperature.trim() === "" || 
        soilMoisture.trim() === "" || humidity.trim() === ""
      ) {
        return res.status(400).json({ error: "All fields are required for every plant." });
      }
    }

    // Insert plants while ignoring duplicates
    const result = await Plant.insertMany(plants, { ordered: false });
    res.status(201).json({ message: "Plants added successfully", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to update real-time plant information
app.put("/plants/RealTimeDetail", async (req, res) => {
  try {
    const { name, temperature, soilMoisture, humidity } = req.body;

    if (!name || !temperature || !soilMoisture || !humidity) {
      return res.status(400).json({ error: "All fields are required to update a plant." });
    }

    // Update plant details without duplicating entries
    const updatedPlant = await Plant.findOneAndUpdate(
      { name },
      { temperature, soilMoisture, humidity },
      { new: true, upsert: true } // Create or update
    );

    res.json({ message: "Plant details updated successfully", updatedPlant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
