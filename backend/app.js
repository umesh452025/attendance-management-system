const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const attendanceRoutes = require('./routes/attendance');
const userRoutes = require('./routes/user');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('../frontend')); // Serve static files from frontend

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/attendanceDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/attendance', attendanceRoutes);
app.use('/api/users', userRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
