const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const app = express();
const cookieParser = require('cookie-parser');
const client = require('./db/connection');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const apiRoutes = require('./routes');

app.use(jsonParser);
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(cors({origin: '*'}));
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use('/', apiRoutes);
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

client.connect();