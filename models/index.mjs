import sequelizePackage from 'sequelize';
import allConfig from '../config/config.js';

import initUserModel from './user.mjs'
import initGameModel from './game.mjs'

const { Sequelize } = sequelizePackage;
const env = process.env.NODE_ENV || 'development';
const config = allConfig[env];
const db = {};

let sequelize = new Sequelize(config);

db.User = initUserModel(sequelize, Sequelize.DataTypes);
db.Game = initGameModel(sequelize, Sequelize.DataTypes);

db.User.hasMany(db.Game, {
  foreignKey: "user_id",
});
db.User.hasMany(db.Game, {
  foreignKey: "player2_id",
});
// db.User.hasMany(db.Game, {
//   foreignKey: "player3_id",
// });
// db.User.hasMany(db.Game, {
//   foreignKey: "player4_id",
// });
//look at sequelize self referencing module for alias
// game.getPlayer1()
db.Game.belongsTo(db.User, {
  as: "player1",
  foreignKey: "user_id",
});
db.Game.belongsTo(db.User, {
  as: "player2",
  foreignKey: "player2_id",
});
// db.Game.belongsTo(db.User, {
//   as: "player3",
//   foreignKey: "player3_id",
// });
// db.Game.belongsTo(db.User, {
//   as: "player4",
//   foreignKey: "player4_id",
// });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;