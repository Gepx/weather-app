import api from "./index";

export const weatherApi = {
  searchWeather: async (
    searchType: string,
    searchQuery: string,
    days?: number,
    isCurrentLocation?: boolean
  ) => {
    const response = await api.post("/weather", {
      searchType,
      searchQuery,
      days,
      isCurrentLocation,
    });
    return response.data;
  },

  getWeatherHistory: async () => {
    const response = await api.get("/weather");
    return response.data;
  },

  updateWeatherRecord: async (
    id: string,
    searchType: string,
    searchQuery: string,
    days?: number,
  ) => {
    const response = await api.put(`/weather/${id}`, {
      searchQuery,
      searchType,
      days,
    });
    return response.data;
  },

  deleteWeatherRecord: async (id: string) => {
    const response = await api.delete(`/weather/${id}`);
    return response.data;
  },

  exportWeather: async (format: "json" | "csv" | "pdf", id?: string) => {
    const url = id
      ? `/weather/export?format=${format}&id=${id}`
      : `/weather/export?format=${format}`;
    const response = await api.get(url, {
      responseType: "blob",
    });
    return response.data;
  },
};
