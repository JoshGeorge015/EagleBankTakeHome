import { Router } from 'express';
import {getAccount, getAccounts, createAccount, updateAccount, deleteAccount} from '../controllers/accountController.js';
import requireAuth from '../middleware/userAuth.js';

const router = Router();

router.post('/', requireAuth, createAccount);
router.get('/', requireAuth, getAccounts);
router.get('/:accountId', requireAuth, getAccount);
router.patch('/:accountId', requireAuth, updateAccount);
router.delete('/:accountId', requireAuth, deleteAccount);

export default router;