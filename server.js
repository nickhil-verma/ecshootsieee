// const express = require("express");
// const mongoose = require("mongoose");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect("mongodb+srv://eng23ec0100:QcamHldeMoG0Mm5U@cluster0.jphyn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection failed:", err));

// // Plant Schema and Model
// const plantSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true }, // Ensuring unique names
//   temperature: { type: String, required: true },
//   soilMoisture: { type: String, required: true },
//   humidity: { type: String, required: true },
// });

// const Plant = mongoose.model("Plant", plantSchema);

// // Route to get all plant information
// app.get("/plants", async (req, res) => {
//   try {
//     const plants = await Plant.find();
//     res.json(plants);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Route to add new plants (Batch addition)
// // Route to add new plants (Batch addition)
// // Route to add new plants (Batch addition)
// app.post("/plants", async (req, res) => {
//   try {
//     const plants = req.body;

//     // Validate each plant in the array
//     for (const plant of plants) {
//       const { name, temperature, soilMoisture, humidity } = plant;

//       // Ensure all fields are present and not empty
//       if (
//         !name || !temperature || !soilMoisture || !humidity || 
//         name.trim() === "" || temperature.trim() === "" || 
//         soilMoisture.trim() === "" || humidity.trim() === ""
//       ) {
//         return res.status(400).json({ error: "All fields are required for every plant." });
//       }
//     }

//     // Insert plants while ignoring duplicates
//     const result = await Plant.insertMany(plants, { ordered: false });
//     res.status(201).json({ message: "Plants added successfully", result });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });



// // Route to update real-time plant information
// app.put("/plants/RealTimeDetail", async (req, res) => {
//   try {
//     const { name, temperature, soilMoisture, humidity } = req.body;

//     if (!name || !temperature || !soilMoisture || !humidity) {
//       return res.status(400).json({ error: "All fields are required to update a plant." });
//     }

//     // Update plant details without duplicating entries
//     const updatedPlant = await Plant.findOneAndUpdate(
//       { name },
//       { temperature, soilMoisture, humidity },
//       { new: true, upsert: true } // Create or update
//     );

//     res.json({ message: "Plant details updated successfully", updatedPlant });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Start Server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
