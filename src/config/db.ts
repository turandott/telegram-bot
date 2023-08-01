import { Sequelize } from 'sequelize';

// const sequelize = new Sequelize('telegram', 'root', 'password', {
//   host: 'master.411588c1-40dd-4657-a2a2-f0163fb8d790.c.dbaas.selcloud.ru',
//   port: 5432,
//   dialect: 'postgres',
// });
const sequelize = new Sequelize("telegram", "root", "password", {
  dialect: "mysql",
  host: "localhost",
});
const db = {};

export default sequelize;
