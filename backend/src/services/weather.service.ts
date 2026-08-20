import axios, { type AxiosInstance } from "axios";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import weatherModel from "../model/weather.model.js";
import NotFoundError from "../errors/notFound.error.js";
import { ErrorCode } from "../errors/custom.error.js";

export const createWeatherDataService =
  (apiClient: AxiosInstance) =>
  async (searchType: string, searchQuery: string, days?: number) => {
    let queryParams = "";

    switch (searchType) {
      case "city":
        queryParams = `q=${searchQuery}`;
        break;
      case "zipCode":
        queryParams = `zip=${searchQuery}`;
        break;
      case "coordinates":
        const [lat, lon] = searchQuery.split(",");
        queryParams = `lat=${lat}&lon=${lon}`;
        break;
      default:
        queryParams = `q=${searchQuery}`;
        break;
    }

    let cntParam = "";
    if (days) {
      cntParam = `&cnt=${days}`;
    }

    const url = `${process.env.API_BASE_URL}?${queryParams}${cntParam}&appid=${process.env.OPENWEATHER_API_KEY}`;

    const response = await apiClient.get(url);
    const weatherData = response.data;

    let locationDescription = "Description not available.";
    const cityName = weatherData.city?.name || weatherData.name;
    if (cityName) {
      const wikiUrl = `${process.env.WIKIPEDIA_BASE_URL}/page/summary/${encodeURIComponent(cityName)}`;
      const wikiResponse = await apiClient.get(wikiUrl).catch(() => null);
      if (wikiResponse?.data?.extract) {
        locationDescription = wikiResponse.data.extract;
      }
    }

    return { ...weatherData, locationDescription };
  };

export const getWeatherDataService = () => async () => {
  const weatherData = await weatherModel.find({});

  if (!weatherData || weatherData.length === 0) {
    throw new NotFoundError("Weather not found!", ErrorCode.NOT_FOUND);
  }

  return weatherData;
};

export const updateWeatherDataService =
  () =>
  async (id: string, searchType: string, searchQuery: string, days: number) => {
    const userInputData = await createWeatherDataService(axios)(
      searchType,
      searchQuery,
      days,
    );

    const weatherData = await weatherModel.findByIdAndUpdate(
      id,
      {
        $set: {
          searchType: searchType,
          searchQuery: searchQuery,
          resolvedLocationName:
            userInputData.city?.name || userInputData.name || "Unknown",
          locationDescription: userInputData.locationDescription,
          days: days,
          weatherData: userInputData,
        },
      },
      { new: true },
    );

    if (!weatherData) {
      throw new NotFoundError("Weather not found!", ErrorCode.NOT_FOUND);
    }

    return weatherData;
  };

export const deleteWeatherDataService = () => async (id: string) => {
  const weatherData = await weatherModel.findByIdAndDelete(id);

  if (!weatherData) {
    throw new NotFoundError("Weather not found!", ErrorCode.NOT_FOUND);
  }

  return weatherData;
};

export const exportWeatherDataService =
  () => async (format: string, id?: string) => {
    const weatherData = id
      ? await weatherModel.find({ _id: id })
      : await weatherModel.find({});

    if (!weatherData || weatherData.length === 0) {
      throw new NotFoundError("Weather not found!", ErrorCode.NOT_FOUND);
    }

    if (format === "csv") {
      const parser = new Parser({
        fields: [
          "_id",
          "searchType",
          "searchQuery",
          "resolvedLocationName",
          "locationDescription",
          "days",
        ],
      });
      return parser.parse(weatherData);
    }

    if (format === "pdf") {
      return new Promise<Buffer>((resolve, reject) => {
        try {
          const doc = new PDFDocument();
          const buffers: Buffer[] = [];
          doc.on("data", buffers.push.bind(buffers));
          doc.on("end", () => {
            resolve(Buffer.concat(buffers));
          });

          doc.fontSize(20).text("Weather Data Export", { underline: true });
          doc.moveDown();

          weatherData.forEach((item, index) => {
            doc.fontSize(14).text(`Record #${index + 1}: ${item.resolvedLocationName}`);
            doc.fontSize(12).text(`Search: ${item.searchType} (${item.searchQuery})`);
            doc.text(`Description: ${item.locationDescription || "N/A"}`);
            doc.text(`Days Forecasted: ${item.days || "N/A"}`);
            doc.moveDown();
          });

          doc.end();
        } catch (error) {
          reject(error);
        }
      });
    }

    return weatherData;
  };
