const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const limiter = require('./middleware/rateLimiter');
const config = require('./config/config');
const { globalErrorHandler } = require('./utils/errorHandler');

const app = express();
connectDB();


app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(express.json({ limit: '10kb' })); 

// Routes for api
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/appraisals', require('./routes/appraisalRoutes'));
app.use('/api/mappings', require('./routes/mappingRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));

// Error Handler
// app.use(globalErrorHandler);

const PORT = config.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!  Shutting down...');
  console.log(err.name, err.message);

  // Gracefully shutdown the server
  server.close(() => {
    process.exit(1);
  });
});
