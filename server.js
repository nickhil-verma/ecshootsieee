const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
//QcamHldeMoG0Mm5U
// MongoDB Connection
mongoose.connect("mongodb+srv://eng23ec0100:QcamHldeMoG0Mm5U@cluster0.jphyn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed:", err));

// Plant Schema and Model
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

// Route to get all plant information
app.get("/plants", async (req, res) => {
  try {
    const plants = await Plant.find();
    res.json(plants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to add a new plant
app.post("/plants", async (req, res) => {
    try {
      const plants = req.body;
  
      // Validate each plant in the array
      for (const plant of plants) {
        const { name, temperature, humidity, soilMoisture, light, waterRequirement } = plant;
        
        if (
          !name ||
          !temperature ||
          !humidity ||
          !soilMoisture ||
          !waterRequirement ||
          !light?.blueLight ||
          !light?.redLight ||
          !light?.fullSpectrum
        ) {
          return res.status(400).json({ error: "All fields are required for every plant." });
        }
      }
  
      // Save all valid plants to the database
      await Plant.insertMany(plants);
      res.status(201).json({ message: "Plants added successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
