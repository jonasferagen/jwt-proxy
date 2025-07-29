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
      headers: {
        'Cookie': req.headers.cookie || '',
        'User-Agent': req.headers['user-agent'],
        'X-Forwarded-For': req.ip,
      },
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

  console.log('--- PROXY POST REQUEST ---');
  console.log('Path:', req.path);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('Query:', req.query);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('--------------------------');

  try {
    const response = await axios.post(`${WC_API}${req.path}`, req.body, {
      params: req.query,
      headers: {
        'Cookie': req.headers.cookie || '',
        'User-Agent': req.headers['user-agent'],
        'X-Forwarded-For': req.ip,
      },
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
