
/**
 * Express Application Setup
 * Configures middleware and routes for the Eagle Bank API.
 *
 * @module app
 */
import express, { json } from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(json());

app.use('/v1/users', userRoutes);
app.use('/v1/accounts', accountRoutes);
app.use('/v1/accounts/:accountId/transactions', transactionRoutes);

app.use(errorHandler);

export default app;
