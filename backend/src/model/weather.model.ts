import { model, Schema } from "mongoose";
import type { IWeather } from "../interfaces/weather.interface.js";

const weatherSchema = new Schema<IWeather>({
  searchType: {
    type: String,
    enum: ["city", "zipCode", "coordinates"],
    required: true,
  },
  searchQuery: {
    type: String,
    required: true,
  },
  resolvedLocationName: {
    type: String,
    required: true,
  },
  locationDescription: {
    type: String,
    required: false,
  },
  days: {
    type: Number,
    required: false,
    min: 1,
    max: 16,
  },
  weatherData: {
    type: Object,
    required: true,
  },
  isCurrentLocation: {
    type: Boolean,
    default: false,
  },
});

export default model<IWeather>("Weather", weatherSchema);
