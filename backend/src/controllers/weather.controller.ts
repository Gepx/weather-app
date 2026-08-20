import { type Request, type Response, type NextFunction } from "express";
import axios from "axios";
import WeatherModel from "../model/weather.model.js";
import {
  createWeatherDataService,
  deleteWeatherDataService,
  getWeatherDataService,
  updateWeatherDataService,
  exportWeatherDataService,
} from "../services/weather.service.js";

export const createWeatherSearchController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { searchType, searchQuery, days } = req.body;

    const weatherData = await createWeatherDataService(axios)(
      searchType,
      searchQuery,
      days,
    );

    const savedWeatherSearch = await WeatherModel.create({
      searchType,
      searchQuery,
      resolvedLocationName:
        weatherData.city?.name || weatherData.name || "Unknown",
      locationDescription: weatherData.locationDescription,
      days,
      weatherData: weatherData,
    });

    res.status(201).json({
      success: true,
      data: savedWeatherSearch,
      message: "Weather fetched and saved successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const getWeatherDataController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getWeatherData = await getWeatherDataService()();

    res.status(200).json({
      success: true,
      data: getWeatherData,
      message: "Weather fetched successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const updateWeatherDataController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { searchType, searchQuery, days } = req.body;

    const updatedWeatherData = await updateWeatherDataService()(
      id as string,
      searchType,
      searchQuery,
      days,
    );

    res.status(200).json({
      success: true,
      data: updatedWeatherData,
      message: "Weather updated successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWeatherDataController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const deletedWeatherData = await deleteWeatherDataService()(id as string);

    res.status(200).json({
      success: true,
      data: deletedWeatherData,
      message: "Weather deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const exportWeatherDataController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { format, id } = req.query;
    const exportData = await exportWeatherDataService()(
      format as string,
      id as string,
    );

    if (format === "pdf") {
      res.header("Content-Type", "application/pdf");
      res.attachment(id ? `weather_export_${id}.pdf` : "weather_export.pdf");
      res.status(200).send(exportData);
      return;
    }

    if (format === "csv") {
      res.header("Content-Type", "text/csv");
      res.attachment(id ? `weather_export_${id}.csv` : "weather_export.csv");
      res.status(200).send(exportData);
      return;
    }

    res.header("Content-Type", "application/json");
    res.attachment(id ? `weather_export_${id}.json` : "weather_export.json");
    res.status(200).send(JSON.stringify(exportData, null, 2));
    return;
  } catch (error) {
    next(error);
  }
};
