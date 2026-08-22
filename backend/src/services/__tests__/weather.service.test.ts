import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import weatherModel from "../../model/weather.model.js";
import {
  createWeatherDataService,
  getWeatherDataService,
  updateWeatherDataService,
  deleteWeatherDataService,
  exportWeatherDataService,
} from "../weather.service.js";
import NotFoundError from "../../errors/notFound.error.js";

vi.mock("axios");

vi.mock("../../model/weather.model.js", () => {
  return {
    default: {
      find: vi.fn(),
      findByIdAndUpdate: vi.fn(),
      findByIdAndDelete: vi.fn(),
    },
  };
});

describe("Weather Services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.API_BASE_URL =
      "https://api.openweathermap.org/data/2.5/forecast";
    process.env.WIKIPEDIA_BASE_URL = "https://en.wikipedia.org/api/rest_v1";
    process.env.OPENWEATHER_API_KEY = "test-key";
  });

  describe("createWeatherDataService", () => {
    it("should fetch weather data and wikipedia description", async () => {
      const mockWeatherResponse = {
        data: { list: [], city: { name: "London" } },
      };
      const mockWikiResponse = { data: { extract: "London is the capital." } };

      vi.mocked(axios.get)
        .mockResolvedValueOnce(mockWeatherResponse)
        .mockResolvedValueOnce(mockWikiResponse);

      const result = await createWeatherDataService(axios)("city", "London");

      expect(axios.get).toHaveBeenNthCalledWith(
        1,
        "https://api.openweathermap.org/data/2.5/forecast?q=London&appid=test-key",
      );
      expect(axios.get).toHaveBeenNthCalledWith(
        2,
        "https://en.wikipedia.org/api/rest_v1/page/summary/London",
        { headers: { "User-Agent": "WeatherApp/1.0" } },
      );
      expect(result).toEqual({
        ...mockWeatherResponse.data,
        locationDescription: "London is the capital.",
      });
    });

    it("should fetch weather data from API with days", async () => {
      const mockResponse = { data: { list: [], city: { name: "London" } } };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      const result = await createWeatherDataService(axios)("city", "London", 5);

      expect(axios.get).toHaveBeenCalledWith(
        "https://api.openweathermap.org/data/2.5/forecast?q=London&cnt=40&appid=test-key",
      );
      expect(result).toEqual({
        ...mockResponse.data,
        locationDescription: "Description not available.",
      });
    });

    it("should fetch weather data using zipCode", async () => {
      const mockResponse = { data: { list: [] } };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      const result = await createWeatherDataService(axios)("zipCode", "10001");

      expect(axios.get).toHaveBeenCalledWith(
        "https://api.openweathermap.org/data/2.5/forecast?zip=10001&appid=test-key",
      );
      expect(result).toEqual({
        ...mockResponse.data,
        locationDescription: "Description not available.",
      });
    });

    it("should fetch weather data using coordinates", async () => {
      const mockResponse = { data: { list: [] } };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      const result = await createWeatherDataService(axios)(
        "coordinates",
        "40.71,-74.00",
      );

      expect(axios.get).toHaveBeenCalledWith(
        "https://api.openweathermap.org/data/2.5/forecast?lat=40.71&lon=-74.00&appid=test-key",
      );
      expect(result).toEqual({
        ...mockResponse.data,
        locationDescription: "Description not available.",
      });
    });

    it("should fallback to city query for unknown searchType", async () => {
      const mockResponse = { data: { list: [] } };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      // Bypass TS typing to test the default fallback at runtime
      const result = await createWeatherDataService(axios)(
        "alien" as any,
        "Mars",
      );

      expect(axios.get).toHaveBeenCalledWith(
        "https://api.openweathermap.org/data/2.5/forecast?q=Mars&appid=test-key",
      );
      expect(result).toEqual({
        ...mockResponse.data,
        locationDescription: "Description not available.",
      });
    });
  });

  describe("getWeatherDataService", () => {
    it("should return weather data if records exist", async () => {
      const mockData = [{ searchType: "city", searchQuery: "London" }];
      vi.mocked(weatherModel.find).mockResolvedValue(mockData as any);

      const result = await getWeatherDataService()();

      expect(weatherModel.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockData);
    });
  });

  describe("updateWeatherDataService", () => {
    it("should update weather data", async () => {
      const mockApiData = { name: "Paris", list: [] };
      vi.mocked(axios.get).mockResolvedValue({ data: mockApiData });

      const mockUpdatedData = { _id: "123", resolvedLocationName: "Paris" };
      vi.mocked(weatherModel.findByIdAndUpdate).mockResolvedValue(
        mockUpdatedData as any,
      );

      const result = await updateWeatherDataService()(
        "123",
        "city",
        "Paris",
        3,
      );

      expect(weatherModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "123",
        expect.objectContaining({
          $set: expect.objectContaining({
            searchType: "city",
            searchQuery: "Paris",
            days: 3,
          }),
        }),
        { new: true },
      );
      expect(result).toEqual(mockUpdatedData);
    });

    it("should update weather data using city name from API response", async () => {
      const mockApiData = { city: { name: "London" }, list: [] };
      vi.mocked(axios.get).mockResolvedValue({ data: mockApiData });

      const mockUpdatedData = { _id: "123", resolvedLocationName: "London" };
      vi.mocked(weatherModel.findByIdAndUpdate).mockResolvedValue(
        mockUpdatedData as any,
      );

      await updateWeatherDataService()("123", "city", "London", 3);

      expect(weatherModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "123",
        expect.objectContaining({
          $set: expect.objectContaining({
            resolvedLocationName: "London",
          }),
        }),
        { new: true },
      );
    });

    it("should update weather data with Unknown if name is missing", async () => {
      const mockApiData = { list: [] };
      vi.mocked(axios.get).mockResolvedValue({ data: mockApiData });

      const mockUpdatedData = { _id: "123", resolvedLocationName: "Unknown" };
      vi.mocked(weatherModel.findByIdAndUpdate).mockResolvedValue(
        mockUpdatedData as any,
      );

      await updateWeatherDataService()("123", "city", "Nowhere", 3);

      expect(weatherModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "123",
        expect.objectContaining({
          $set: expect.objectContaining({
            resolvedLocationName: "Unknown",
          }),
        }),
        { new: true },
      );
    });

    it("should throw NotFoundError if record to update does not exist", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: { name: "Paris" } });
      vi.mocked(weatherModel.findByIdAndUpdate).mockResolvedValue(null as any);

      await expect(
        updateWeatherDataService()("123", "city", "Paris", 3),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("deleteWeatherDataService", () => {
    it("should delete weather data", async () => {
      const mockData = { _id: "123" };
      vi.mocked(weatherModel.findByIdAndDelete).mockResolvedValue(
        mockData as any,
      );

      const result = await deleteWeatherDataService()("123");

      expect(weatherModel.findByIdAndDelete).toHaveBeenCalledWith("123");
      expect(result).toEqual(mockData);
    });

    it("should throw NotFoundError if record to delete does not exist", async () => {
      vi.mocked(weatherModel.findByIdAndDelete).mockResolvedValue(null as any);

      await expect(deleteWeatherDataService()("123")).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe("exportWeatherDataService", () => {
    it("should export JSON data for all records", async () => {
      const mockData = [{ searchType: "city", searchQuery: "London" }];
      vi.mocked(weatherModel.find).mockResolvedValue(mockData as any);

      const result = await exportWeatherDataService()("json");

      expect(weatherModel.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockData);
    });

    it("should export JSON data for a single record", async () => {
      const mockData = [{ searchType: "city", searchQuery: "London" }];
      vi.mocked(weatherModel.find).mockResolvedValue(mockData as any);

      const result = await exportWeatherDataService()("json", "123");

      expect(weatherModel.find).toHaveBeenCalledWith({ _id: "123" });
      expect(result).toEqual(mockData);
    });

    it("should export CSV data", async () => {
      const mockData = [
        { _id: "1", searchType: "city", searchQuery: "London" },
      ];
      vi.mocked(weatherModel.find).mockResolvedValue(mockData as any);

      const result = await exportWeatherDataService()("csv");
      expect(typeof result).toBe("string");
      expect((result as string).includes("London")).toBe(true);
    });

    it("should export PDF data", async () => {
      const mockData = [
        { _id: "1", searchType: "city", searchQuery: "London" },
      ];
      vi.mocked(weatherModel.find).mockResolvedValue(mockData as any);

      const result = await exportWeatherDataService()("pdf");
      expect(Buffer.isBuffer(result)).toBe(true);
    });

    it("should throw NotFoundError if no data exists", async () => {
      vi.mocked(weatherModel.find).mockResolvedValue([] as any);

      await expect(exportWeatherDataService()("json")).rejects.toThrow(
        NotFoundError,
      );
    });

    it("should reject promise if PDF generation fails", async () => {
      vi.mocked(weatherModel.find).mockResolvedValue([null] as any);

      await expect(exportWeatherDataService()("pdf")).rejects.toThrow(
        TypeError,
      );
    });
  });
});
