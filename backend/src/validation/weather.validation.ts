import z from "zod";

export const weatherSchema = z.object({
  searchType: z.enum(["city", "zipCode", "coordinates"]),
  searchQuery: z.string(),
  resolvedLocationName: z.string(),
  locationDescription: z.string().optional(),
  days: z.number().min(1).max(16).optional(),
  weatherData: z.object({}),
});

export type WeatherSchema = z.infer<typeof weatherSchema>;
