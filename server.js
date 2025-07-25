const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const { CK, CS, WC_API } = process.env;

app.get('{*any}', async (req, res) => {

  try {
    const response = await axios.get(`${WC_API}${req.path}`, {
      params: req.query,
      auth: {
        username: CK,
        password: CS
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('{*any}', async (req, res) => {

  try {
    const response = await axios.post(`${WC_API}${req.path}`, req.body, {
      params: req.query,
      auth: {
        username: CK,
        password: CS
      }
    });
    res.json(response.data);
  } catch (err) {

    console.error(err);
    res.status(500).json({ error: err });
  }
});

app.listen(3001, () => {
  console.log('Proxy server running on http://localhost:3001');
});
