import db from './index.js';

const { User } = db;
const { Weather } = db;

export async function userToWetherUnsubscribe(userId) {
  const existingUser = await User.findOne({ chatId: userId });

  await Weather.deleteOne({ user: existingUser._id });

  await User.deleteOne({ chatId: userId });
}
