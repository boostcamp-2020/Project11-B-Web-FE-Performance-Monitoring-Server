import jwt from 'jsonwebtoken';

require('dotenv').config();

const checkToken = (jwtToken: string): string | undefined => {
  const jwtSecret: string | undefined = process.env.JWT_SECRET;
  if (jwtSecret !== undefined) {
    const userId: any = jwt.verify(jwtToken, jwtSecret);
    // eslint-disable-next-line no-underscore-dangle
    return userId._id;
  }
  return undefined;
};
export default checkToken;
