import fetch from 'node-fetch';
import User, { UserType, UserDocument } from '../../../models/User';

const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;

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

export { processGithubOAuth, insertUser };
