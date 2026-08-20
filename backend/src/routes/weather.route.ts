import express from "express";
import {
  createWeatherSearchController,
  deleteWeatherDataController,
  getWeatherDataController,
  updateWeatherDataController,
  exportWeatherDataController,
} from "../controllers/weather.controller.js";

const WeatherRoutes = express.Router();

WeatherRoutes.post("/", createWeatherSearchController);
WeatherRoutes.get("/", getWeatherDataController);
WeatherRoutes.get("/export", exportWeatherDataController);
WeatherRoutes.put("/:id", updateWeatherDataController);
WeatherRoutes.delete("/:id", deleteWeatherDataController);

export default WeatherRoutes;
