import { defineCollection, reference, z } from "astro:content";
import { file } from "astro/loaders";
import { parse as csvParse } from "csv-parse/sync";

const circuits = defineCollection({
  loader: file("src/data/circuits.csv", {
    parser: (fileContent) =>
      csvParse(fileContent, { columns: true, skip_empty_lines: true }),
  }),
  schema: z.object({
    id: z.string(),
    wikiUrl: z.string().url(),
    name: z.string(),
    locality: z.string(),
    country: z.string(),
    latitude: z.string(),
    longitude: z.string(),
  }),
});

const constructors = defineCollection({
  loader: file("src/data/constructors.csv", {
    parser: (fileContent) =>
      csvParse(fileContent, { columns: true, skip_empty_lines: true }),
  }),
  schema: z.object({
    year: z.coerce.number(),
    id: z.string(),
    wikiUrl: z.string().url(),
    name: z.string(),
    nationality: z.string(),
  }),
});

const driverStandings = defineCollection({
  loader: file("src/data/driver_standings.csv", {
    parser: (fileContent) =>
      csvParse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ";",
      }),
  }),
  schema: z.object({
    id: z.string(),
    season: z.coerce.number().min(2000).max(2024),
    round: z.coerce.number().min(1).max(25),
    position: z.coerce.number().min(0).max(30),
    points: z.coerce.number().min(0).max(1000),
    wins: z.coerce.number().min(0).max(25),
    driverId: reference("drivers"),
  }),
});

const drivers = defineCollection({
  loader: file("src/data/drivers.csv", {
    parser: (fileContent) =>
      csvParse(fileContent, { columns: true, skip_empty_lines: true }),
  }),
  schema: z.object({
    id: z.string(),
    wikiUrl: z.string().url(),
    name: z.string(),
    familyName: z.string(),
    dateOfBirth: z.string().date(),
    nationality: z.string(),
  }),
});

const results = defineCollection({
  loader: file("src/data/results.csv", {
    parser: (fileContent) =>
      csvParse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ";",
      }),
  }),
  schema: z.object({
    id: z.string(),
    season: z.coerce.number().min(2000).max(2024),
    round: z.coerce.number().min(1).max(25),
    circuitId: reference("circuits"),
    country: z.string(),
    constructorId: reference("constructors"),
    driverId: reference("drivers"),
    position: z.coerce.number().min(0).max(25),
    points: z.coerce.number().min(0).max(50),
    grid: z.coerce.number().min(0).max(25),
    status: z.string(),
    differenceGridPosition: z.coerce.number().min(-25).max(25),
  }),
});

const seasons = defineCollection({
  loader: file("src/data/seasons.csv", {
    parser: (fileContent) =>
      csvParse(fileContent, { columns: true, skip_empty_lines: true }),
  }),
  schema: z.object({
    id: z.coerce.number(),
    wikiUrl: z.string().url(),
  }),
});

export const collections = {
  circuits,
  constructors,
  driverStandings,
  drivers,
  results,
  seasons,
};
