const modelUser = require('../models/user')
const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");
const User = modelUser.userModel
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.fetch = function(req,res){
    (async () => {
        await sequelize.sync({ force: true });
        const getUsers = await User.findAll({
            attributes: ['name','username','email', 'phone', 'balance']
        });
        console.log(getUsers.every(user => user instanceof User)); // true
        console.log("All users:", JSON.stringify(getUsers, null, 2));
        res.send(getUsers)
    })();
}

exports.register = function(req,res){
    (async () => {
        try {
            var post      = req.body;
            var name      = post.name;
            var username  = post.username;
            var phone     = post.phone;
            var email     = post.email;
            var password  = post.password;

            const salt    = await bcrypt.genSalt()
            const hashPassword = await bcrypt.hash(password, salt)

            const newUser = await User.create({ 
                name: name,
                username: username,
                phone: phone,
                email: email,
                password: hashPassword
            });

            console.log("New User auto-generated username:", newUser.username);
            res.send("User successfully created !")
            
        } catch (error) {
            res.status(404).send("Something error, please check the field !")
        }
    })();
}

exports.login = function(req,res){
    (async () => {
        try {
            var password = req.body.password
                        
            const user = await User.findOne({
                where:
                {
                    email: req.body.email
                }
            })

            if (user){
                const match = await bcrypt.compare(password, user.password)
                if(!match) {
                    res.status(400).send("Wrong password !")
                } else {
                    const userName = user.name
                    const userEmail = user.email
                    
                    const accesToken = jwt.sign({userName,userEmail}, process.env.ACCESS_TOKEN_SECRET,{
                        expiresIn: '60s'
                    })
                    const refreshToken = jwt.sign({userName,userEmail}, process.env.REFRESH_TOKEN_SECRET,{
                        expiresIn: '1d'
                    })
                    await User.update({ refresh_token: refreshToken },{
                        where: {
                            email: userEmail
                        }
                    })

                    res.cookie('refreshToken',refreshToken,{
                        httpOnly: true,
                        maxAge  : 24 * 60 * 60 * 100
                    })

                    res.json({ accesToken })
                    // res.send("Login Successfully !")
                }
            }
           
        } catch (error) {
            res.status(404).send("Something error, please check the field !")
            if (error) throw error
        }
    })();
}

exports.topup = function(req,res){
    (async () => {
        try {
            var post = req.body
            var amount = post.amount
            var phone = post.phone
            const user = await User.findOne({
                where:{
                    phone: phone
                }
            })

            if(user){
                const userPhone = user.phone
                const saldo = user.balance
                const topup = +saldo + +amount
                await User.update({ balance: topup},{
                    where:{
                        phone: userPhone
                    }
                })
                res.json({"topup":topup})
            }
        } catch (error) {
            res.status(404).send("Something error, please check the field !")
        }
    })();
}