export interface IWeather {
  searchType: "city" | "zipCode" | "coordinates";
  searchQuery: string;
  resolvedLocationName: string;
  locationDescription?: string;
  days?: number;
  weatherData: Record<string, any>;
}
