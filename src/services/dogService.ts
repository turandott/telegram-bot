import axios from 'axios';

import { DOG_API } from '../config/env.config';
import { Photo } from '../types';

async function getDogImage(): Promise<Photo> {
  try {
    const response = await axios.get(DOG_API);
    const imageUrl = response.data[0].url;
    return imageUrl;
  } catch (error) {
    console.error('Error fetching dog image:', error);
    throw error;
  }
}

export default { getDogImage };
