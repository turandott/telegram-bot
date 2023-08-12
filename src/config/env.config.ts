import dotenv from "dotenv";
dotenv.config({ path: "./src/config/.env" });

export const TOKEN = process.env.TOKEN;
export const DATA_BASE = process.env.DATA_BASE;
export const WEATHER_KEY = process.env.WEATHER_KEY;
export const PLACE_KEY = process.env.PLACE_KEY;

export const CAT_API = process.env.CAT_API;
export const DOG_API = process.env.DOG_API;
export const WEATHER_API = process.env.WEATHER_API;
export const PLACE_API = process.env.PLACE_API;
