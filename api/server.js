const express = require('express');
const cors = require('cors');
const routes = require('./routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request body

// Routes
app.use('/api', routes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
