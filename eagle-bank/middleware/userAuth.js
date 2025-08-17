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

export default requireAuth;