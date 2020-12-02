import jwt from 'jsonwebtoken';

const checkToken = (jwtToken: string): string => {
  const jwtSecret: string = process.env.JWT_SECRET as string;
  const userId: any = jwt.verify(jwtToken, jwtSecret);
  // eslint-disable-next-line no-underscore-dangle
  return userId._id;
};
export default checkToken;
