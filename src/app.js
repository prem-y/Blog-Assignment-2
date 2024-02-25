const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const commonMiddleware = require('./middleware/commonMiddleware');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(bodyParser.json());
app.use(commonMiddleware);

mongoose.connect(MONGO_URI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
