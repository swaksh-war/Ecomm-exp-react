require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Import the path module
const productRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

console.log('MongoDB URI:', process.env.MONGO_URI);
app.use('/api', productRoutes);


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB Atlas');
})
.catch((err) => {
    console.error('MongoDB connection error:', err.message);
});

app.get('/', (req, res) => {
    res.send("Hello From Express Server");
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
