import { Router } from 'express';
import { createUser, getUser, updateUser, deleteUser, loginUser, logoutUser} from '../controllers/userController.js';
import requireAuth from '../middleware/userAuth.js';

const router = Router();

router.post('/', createUser);
router.post('/login', loginUser);
router.post('/logout', requireAuth, logoutUser);
router.get('/:userId', requireAuth, getUser);
router.patch('/:userId', requireAuth, updateUser);
router.delete('/:userId', requireAuth, deleteUser);

export default router;