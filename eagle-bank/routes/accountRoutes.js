
/**
 * Account Routes
 * Defines routes for account creation, retrieval, updating, and deletion.
 *
 * @module routes/accountRoutes
 */
import { Router } from 'express';
import {getAccount, getAccounts, createAccount, updateAccount, deleteAccount} from '../controllers/accountController.js';
import requireAuth from '../middleware/userAuth.js';


/**
 * Express router for account routes.
 * @type {import('express').Router}
 */
const router = Router();

router.post('/', requireAuth, createAccount);
router.get('/', requireAuth, getAccounts);
router.get('/:accountId', requireAuth, getAccount);
router.patch('/:accountId', requireAuth, updateAccount);
router.delete('/:accountId', requireAuth, deleteAccount);

export default router;