const express = require('express');
const { globalErrorHandler } = require('./utils/errorHandler');
const authRoutes = require('./routes/authRoutes');
const mappingRoutes = require('./routes/mappingRoutes');
const questionRoutes = require('./routes/questionRoutes');
const appraisalRoutes = require('./routes/appraisalRoutes');
const connectDB= require('./config/database')
const app = express();
require('dotenv').config();

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/mappings', mappingRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/appraisals', appraisalRoutes);

// Global Error Handler
app.use(globalErrorHandler);



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  connectDB();
});
