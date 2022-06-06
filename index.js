require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
const routes = require('./routes/routes');
const app = express();
const database = mongoose.connection;

app.use('/api', routes)

mongoose.connect(mongoString);


database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})


app.use(express.json());

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})