import mongoose, { ConnectOptions } from 'mongoose';

import db from '../models';
import { DATA_BASE } from './env.config';

const dbConnection = mongoose
  .connect(DATA_BASE || 'http://localhost:8000', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  } as ConnectOptions)
  .then((db) => {
    console.log('Database Connected Successfuly.');
  })
  .catch((err) => {
    console.log('Error Connectiong to the Database');
  });

db;

export default dbConnection;
