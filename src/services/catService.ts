import axios from "axios";
import { Photo } from "../types";
import { CAT_API } from "../config/env.config";

async function getCatImage(): Promise<Photo> {
  try {
    const res = await axios.get(CAT_API);
    console.log(res.data[0].url);
    return res.data[0].url;
  } catch (error) {
    console.error("Error fetching cat image:", error);
    throw error;
  }
}

export default { getCatImage };
