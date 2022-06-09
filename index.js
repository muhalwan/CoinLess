const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const app = express();
const cookieParser = require('cookie-parser');
const client = require('./db/conn');
const PORT = process.env.PORT || 5000;
const apiRoutes = require('./routes');

app.use(jsonParser);
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use('/', apiRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

client.connect();
