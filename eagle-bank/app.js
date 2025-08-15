import express, { json } from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import accountRoutes from './routes/accountRoutes';
import transactionRoutes from './routes/transactionRoutes';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(json());

app.use('/v1/users', userRoutes);
app.use('/v1/auth', authRoutes);
app.use('/v1/accounts', accountRoutes);
app.use('/v1/accounts/:accountId/transactions', transactionRoutes);

app.use(errorHandler);

export default app;
