import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import User, { UserDocument } from '../../../models/User';

interface IProfile {
  id: number;
  login: string;
  email: string;
}

const insertUser = async (profile: IProfile): Promise<UserDocument | null> => {
  const { id: uid, login: nickname, email }: IProfile = profile;
  const result = await User.findOneAndUpdate(
    { uid },
    { $setOnInsert: { uid, nickname, email } },
    {
      upsert: true,
    },
  );
  return result;
};

const processGithubOAuth = async (code: string): Promise<UserDocument | null> => {
  const accessResponse = await fetch(
    `https://github.com/login/oauth/access_token?client_id=${
      process.env.NODE_ENV === 'development'
        ? process.env.GITHUB_OAUTH_CLIENT_ID_DEV
        : process.env.GITHUB_OAUTH_CLIENT_ID
    }&client_secret=${
      process.env.NODE_ENV === 'development'
        ? process.env.GITHUB_OAUTH_CLIENT_SECRET_DEV
        : process.env.GITHUB_OAUTH_CLIENT_SECRET
    }&code=${code}`,
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
  const profile: IProfile = await profileResponse.json();
  const newUser: UserDocument | null = await insertUser(profile);
  return newUser;
};

const getToken = (newUser: UserDocument, tokenExpiration: number): string => {
  // eslint-disable-next-line no-underscore-dangle
  const userId: string = newUser._id;
  const jwtSecret: string = process.env.JWT_SECRET as string;
  const jwtToken = jwt.sign({ _id: userId }, jwtSecret, { expiresIn: tokenExpiration });
  return jwtToken;
};
export { processGithubOAuth, getToken };
