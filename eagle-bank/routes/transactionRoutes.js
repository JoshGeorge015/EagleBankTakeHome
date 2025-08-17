
/**
 * Transaction Routes
 * Defines routes for transaction creation and retrieval.
 *
 * @module routes/transactionRoutes
 */
import { Router } from 'express';
import {createTransaction, getTransaction, getTransactions} from '../controllers/transactionController.js';
import requireAuth from '../middleware/userAuth.js';

/**
 * Express router for transaction routes.
 * @type {import('express').Router}
 */
const router = Router();

router.post('/', requireAuth, createTransaction);
router.get('/', requireAuth, getTransactions);
router.get('/:transactionId', requireAuth, getTransaction);

export default router;