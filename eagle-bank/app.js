const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/v1/users', userRoutes);
app.use('/v1/auth', authRoutes);
app.use('/v1/accounts', accountRoutes);
app.use('/v1/accounts/:accountId/transactions', transactionRoutes);

app.use(errorHandler);

module.exports = app;
