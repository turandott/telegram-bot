import sequelize from "../config/db.js";
import DataTypes from "sequelize";

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  chatId: { type: DataTypes.STRING, unique: true },
});

const Weather = sequelize.define("weather", {
  city: { type: DataTypes.STRING, defaultValue: null },
  time: { type: DataTypes.DATE, defaultValue: null },
});

const Notion = sequelize.define("notion", {
  text: { type: DataTypes.STRING, defaultValue: null },
});

User.hasMany(Notion, { foreignKey: "user_id" });
User.hasOne(Weather, { foreignKey: "user_id" });

const db: any = {
  User,
  Weather,
  Notion,
};

export default db;
