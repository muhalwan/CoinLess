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

const PORT = process.env.PORT 
app.listen(PORT,(err)=>{
    if (err) throw err;
    console.log(`Listening on PORT ${PORT}`)
})