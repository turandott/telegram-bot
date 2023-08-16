import db from './index.js';

const { User } = db;
const { Weather } = db;

export async function userToWetherUnsubscribe(userId) {
  const existingUser = await User.findOne({ chatId: userId });
  if (!existingUser) {
    return 'You have no subscription';
  }
  await Weather.deleteMany({ user: existingUser._id });
}
