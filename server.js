const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();


connectDB();


const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions)); 


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Routes
app.use('/api/auth', authRoutes);  
app.use('/api/files', fileRoutes); 


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
