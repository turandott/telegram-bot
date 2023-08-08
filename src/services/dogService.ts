import axios from "axios";
import dotenv from "dotenv";
import { Photo } from "../types";
dotenv.config();

async function getDogImage(): Promise<Photo> {
  try {
    const response = await axios.get(
      process.env.DOG_API
    );
    const imageUrl = response.data[0].url;
    return imageUrl;
  } catch (error) {
    console.error("Error fetching dog image:", error);
    throw error;
  }
}

export default { getDogImage };
