import mongoose from "mongoose";
import dbConnection from "../config/db";

const userSchema = new mongoose.Schema({
  chatId: { type: String, unique: true },
});

const weatherSchema = new mongoose.Schema({
  city: { type: String, default: null },
  time: { type: String, default: null },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const taskSchema = new mongoose.Schema({
  text: { type: String, default: null },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const User = mongoose.model("User", userSchema);
const Weather = mongoose.model("Weather", weatherSchema);
const Task = mongoose.model("Task", taskSchema);

const db = {
  User,
  Weather,
  Task,
};

export default db;

// import sequelize from "../config/db.js";
// import DataTypes from "sequelize";

// const User = sequelize.define("user", {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     unique: true,
//     autoIncrement: true,
//   },
//   chatId: { type: DataTypes.STRING, unique: true },
// });

// const Weather = sequelize.define("weather", {
//   city: { type: DataTypes.STRING, defaultValue: null },
//   time: { type: DataTypes.STRING, defaultValue: null },
// });

// const Notion = sequelize.define("notion", {
//   text: { type: DataTypes.STRING, defaultValue: null },
// });

// User.hasMany(Notion, { foreignKey: "user_id" });
// User.hasOne(Weather, { foreignKey: "user_id" });

// const db: any = {
//   User,
//   Weather,
//   Notion,
// };

// export default db;
