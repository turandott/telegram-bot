import axios from "axios";

async function getCatImage(): Promise<string> {
  try {
    const res = await axios.get("https://api.thecatapi.com/v1/images/search");
    console.log(res.data[0].url);
    return res.data[0].url;
  } catch (error) {
    console.error("Error fetching cat image:", error);
    throw error;
  }
}

export default { getCatImage };
