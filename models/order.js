const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");
const database = require('../config/database')
const db = database.db

exports.orderModel = db.define("orders",{
    order_id: {
       type: DataTypes.STRING,
       primaryKey: true
    },
    email: DataTypes.STRING,
    price: DataTypes.DECIMAL
})
  