import jsonWebToken from 'jsonwebtoken';
import { decode } from 'punycode';
import { getUserById } from '../helper/userHelpers';

export const allowConnectedUsersOnly = () => async (req, res, next) => { 
  try {
    const token = req.headers.authorization;
    // @ts-ignore
    const {userId} = jsonWebToken.verify(token, 'mysecret94652');
    const user = await getUserById(userId);
    if (!user) {
      throw new Error('Unauthorized access');
    } else {
      // @ts-ignore
      req.userId = userId;
      next();
    }
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message || 'unknow_error' });
  }
};
