const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const cors = require('cors');

const app = express();
const cache = new NodeCache({ stdTTL: 3600 }); // Cache data for 1 hour

// Enable CORS
app.use(cors());

// Endpoint to fetch user data
app.get('/user/:username', async (req, res) => {
  const { username } = req.params;

  // Check if data is cached
  const cachedData = cache.get(username);
  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    // Fetch data from LeetCode API
    const response = await axios.get(`https://leetcode-stats-api.herokuapp.com/${username}`);
    const data = response.data;

    // Cache the data
    cache.set(username, data);

    // Return the data
    res.json(data);
  } catch (error) {
    console.error(`Failed to fetch data for ${username}:`, error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});