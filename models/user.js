const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");
const database = require('../config/database')
const db = database.db

exports.userModel = db.define("user", {
  name: DataTypes.STRING,
  username: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    primaryKey : true
  },
  password: DataTypes.STRING,
  refresh_token: DataTypes.TEXT,
  balance: DataTypes.DECIMAL
});

exports.orderModel = db.define("order",{
  order_id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  email: DataTypes.STRING,
  price: DataTypes.DECIMAL
})
