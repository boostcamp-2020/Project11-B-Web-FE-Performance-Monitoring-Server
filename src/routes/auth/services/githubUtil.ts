import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import User, { UserType, UserDocument } from '../../../models/User';

require('dotenv').config();

const clientId: string = process.env.GITHUB_OAUTH_CLIENT_ID as string;
const clientSecret: string = process.env.GITHUB_OAUTH_CLIENT_SECRET as string;

const insertUser = async (profile: any): Promise<UserDocument | null> => {
  const newUser: UserType = {
    uid: profile.id,
    nickname: profile.login,
    email: profile.email,
  };
  const result = await User.findOneAndUpdate(
    { uid: newUser.uid },
    { $setOnInsert: newUser },
    {
      upsert: true,
    },
  );
  return result;
};

const processGithubOAuth = async (code: string): Promise<UserDocument | null> => {
  const accessResponse = await fetch(
    `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`,
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
    },
  );

  const accessResponseBody = await accessResponse.json();
  const accessToken = accessResponseBody.access_token;

  const profileResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      accept: 'application/json',
    },
  });
  const profile: any = await profileResponse.json();
  const newUser: UserDocument | null = await insertUser(profile);
  return newUser;
};

const getToken = (newUser: UserDocument, tokenExpiration: number): string | undefined => {
  // eslint-disable-next-line no-underscore-dangle
  const userId: string = newUser._id;
  const jwtSecret: string = process.env.JWT_SECRET as string;
  const jwtToken = jwt.sign({ _id: userId }, jwtSecret, { expiresIn: tokenExpiration });
  return jwtToken;
};
export { processGithubOAuth, getToken };
