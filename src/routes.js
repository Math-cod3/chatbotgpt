
const express = require('express');
const app = express();

require('dotenv').config()

const routes = express.Router()

app.get('/', (req, res) => {
    res.sendFile('index.html', {
      root: __dirname
    });
  });


module.exports = routes