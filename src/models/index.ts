import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  chatId: { type: String, unique: true },
});

const weatherSchema = new mongoose.Schema({
  city: { type: String, default: null },
  time: { type: String, default: null },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const taskSchema = new mongoose.Schema({
  text: { type: String, default: null },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const taskSubscribeSchema = new mongoose.Schema({
  time: { type: String, default: null },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const User = mongoose.model('User', userSchema);
const Weather = mongoose.model('Weather', weatherSchema);
const Task = mongoose.model('Task', taskSchema);
const TaskSubscribe = mongoose.model('TaskSubscribe', taskSubscribeSchema);

const db = {
  User,
  Weather,
  Task,
  TaskSubscribe,
};

export default db;
