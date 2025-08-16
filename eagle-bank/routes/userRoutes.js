import { Router } from 'express';
import { createUser, getUser, updateUser, deleteUser, loginUser, logoutUser} from '../controllers/userController.js';
import { expressjwt } from 'express-jwt';
import dotenv from 'dotenv';

dotenv.config();

const jwtMiddleware = () =>{return expressjwt
({
  secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], 
    getToken: req => {
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
      ) {
        return req.headers.authorization.split(' ')[1];
      }

  return null;
}

});
}
const requireAuth = jwtMiddleware();

const router = Router();

router.post('/', createUser);
router.post('/login', loginUser);
router.post('/logout', requireAuth, logoutUser);
router.get('/:userId', requireAuth, getUser);
router.patch('/:userId', requireAuth, updateUser);
router.delete('/:userId', requireAuth, deleteUser);

export default router;