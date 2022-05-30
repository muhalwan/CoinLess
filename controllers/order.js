const Order = require('../models/order').orderModel
const User = require('../models/user').userModel
const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')

exports.addOrder = function (req,res) {
    try {
        (async () => {
            var orderId = uuid.v1()

            const newOrder = await Order.create({
                order_id : orderId,
                email : req.body.email,
                price : req.body.price
            })

            console.log(newOrder.order_id)
            res.send("Order created !")
        })();
    } catch (error) {
        res.status(404).send("Something error, please check the field !!")
    }
}