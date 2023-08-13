import axios from 'axios';

import { CAT_API } from '../config/env.config';
import { Photo } from '../types';

async function getCatImage(): Promise<Photo> {
  try {
    const res = await axios.get(CAT_API);
    console.log(res.data[0].url);
    return res.data[0].url;
  } catch (error) {
    console.error('Error fetching cat image:', error);
    throw error;
  }
}

export default { getCatImage };
