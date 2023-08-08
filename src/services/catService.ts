import axios from "axios";
import dotenv from "dotenv";
import { Photo } from "../types";

dotenv.config();

async function getCatImage(): Promise<Photo> {
  try {
    const res = await axios.get(process.env.CAT_API);
    console.log(res.data[0].url);
    return res.data[0].url;
  } catch (error) {
    console.error("Error fetching cat image:", error);
    throw error;
  }
}

export default { getCatImage };
