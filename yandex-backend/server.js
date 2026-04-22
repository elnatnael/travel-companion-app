import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/places", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "lat and lng required" });
  }

  try {
    // Yandex Geocoder HTTP API (JSON!)
    const url =
      `https://geocode-maps.yandex.ru/1.x/?` +
      `apikey=${process.env.YANDEX_API_KEY}` +
      `&geocode=${lng},${lat}` +
      `&lang=en_US` +
      `&kind=locality` +
      `&format=json`;

    const response = await fetch(url);
    const data = await response.json();

    const members =
      data.response.GeoObjectCollection.featureMember || [];

    const places = members.map(m => ({
      name: m.GeoObject.name,
      description: m.GeoObject.description
    }));

    res.json({ places });
  } catch (err) {
    console.error("YANDEX ERROR:", err);
    res.status(500).json({ error: "Yandex request failed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
