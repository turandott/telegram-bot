import axios from "axios";

async function getDogImage(): Promise<string> {
  try {
    const response = await axios.get(
      "https://api.thedogapi.com/v1/images/search"
    );
    const imageUrl = response.data[0].url;
    return imageUrl;
  } catch (error) {
    console.error("Error fetching dog image:", error);
    throw error;
  }
}

export default { getDogImage };
