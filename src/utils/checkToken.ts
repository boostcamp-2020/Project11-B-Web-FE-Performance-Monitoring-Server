import jwt from 'jsonwebtoken';

const checkToken = (jwtToken: string): string | undefined => {
  const jwtSecret: string = process.env.JWT_SECRET as string;
  if (jwtSecret !== undefined) {
    const userId: any = jwt.verify(jwtToken, jwtSecret);
    // eslint-disable-next-line no-underscore-dangle
    return userId._id;
  }
  return undefined;
};
export default checkToken;
