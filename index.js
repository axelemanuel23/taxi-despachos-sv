// Archivo: sv.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://axelemanuel:axelemanuel@clusteraxel.u9b2e.mongodb.net/taxi", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Taxi = mongoose.model("Taxi", {
  id: String,
  estado: String,
  TB: Boolean,
  orden: Number,
  parada: String, // ← este campo es indispensable
});

const Stats = mongoose.model("Stats", {
  despachos: Number,
});

app.get("/", async (req, res) => {
  res.json("Conectado correctamente");
});

app.get("/taxis", async (req, res) => {
  const taxis = await Taxi.find();
  res.json(taxis);
});

app.post("/taxis", async (req, res) => {
  const { id } = req.body;

  try {
    const taxiExistente = await Taxi.findOne({ id });
    if (taxiExistente) {
      return res.status(400).json({ mensaje: "El taxi ya existe en la base de datos." });
    }
    const nuevoTaxi = new Taxi({ ...req.body, parada: "aeropuerto" });
    await nuevoTaxi.save();
    res.status(201).json(nuevoTaxi);
  } catch (error) {
    console.error("Error al guardar taxi:", error);
    res.status(500).json({ mensaje: "Error del servidor al guardar el taxi." });
  }
});

app.post("/stats/reset", async (req, res) => {
  let stats = await Stats.findOne();
  if (!stats) {
    stats = new Stats({ despachos: 0 });
  } else {
    stats.despachos = 0;
  }
  await stats.save();
  res.json(stats);
});

app.put("/taxis/:id", async (req, res) => {
  await Taxi.findOneAndUpdate({ id: req.params.id }, req.body);
  res.sendStatus(200);
});

app.get("/stats", async (req, res) => {
  let stats = await Stats.findOne();
  if (!stats) {
    stats = new Stats({ despachos: 0 });
    await stats.save();
  }
  res.json(stats);
});

app.post("/stats/incrementar", async (req, res) => {
  let stats = await Stats.findOne();
  if (!stats) {
    stats = new Stats({ despachos: 0 });
  }
  stats.despachos += 1;
  await stats.save();
  res.json(stats);
});

app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});
