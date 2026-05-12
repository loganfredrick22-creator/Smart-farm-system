const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const corsOptions = require('./config/cors');
const env = require('./config/env');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const livestockRoutes = require('./modules/livestock/livestock.routes');
const cropRoutes = require('./modules/crops/crop.routes');
const financeRoutes = require('./modules/finance/finance.routes');
const healthRoutes = require('./modules/health/health.routes');
const messagingRoutes = require('./modules/messaging/messaging.routes');
const alertRoutes = require('./modules/alerts/alert.routes');

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many auth attempts, please slow down' },
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: env.nodeEnv === 'development' ? 500 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later' },
});

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Smart Farm API is running', timestamp: new Date().toISOString() });
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/livestock', livestockRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/messaging', messagingRoutes);
app.use('/api/alerts', alertRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
