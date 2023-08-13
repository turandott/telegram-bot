import dotenv from 'dotenv';

dotenv.config({ path: './src/config/.env' });

export const { TOKEN } = process.env;
export const { DATA_BASE } = process.env;
export const { WEATHER_KEY } = process.env;
export const { PLACE_KEY } = process.env;

export const { CAT_API } = process.env;
export const { DOG_API } = process.env;
export const { WEATHER_API } = process.env;
export const { PLACE_API } = process.env;
