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
  const nuevoTaxi = new Taxi(req.body);
  await nuevoTaxi.save();
  res.json(nuevoTaxi);
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
