require('dotenv').config();

const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';

let accessToken;

const getAccessToken = async () => {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    });
    accessToken = response.data.access_token;
  } catch (error) {
    console.error('Could not retrieve access token', error);
  }
};

getAccessToken();

app.get('/api/songs', async (req, res) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/tracks/2TpxZ7JUBn3uw46aR7qd6V', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    res.send(response.data);
  } catch (error) {
    console.error('API request failed', error);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
