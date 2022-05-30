const { Sequelize } = require('sequelize');

exports.db = new Sequelize('coinless', 'uyuxgntwayyym696', 'WKvH2CvIrnpGOKGPYZLW', {
    host: 'bttogl4fpt9desspbkb0-mysql.services.clever-cloud.com',
    dialect: 'mysql'
});
