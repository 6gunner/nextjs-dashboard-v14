import NextAuth, { } from 'next-auth';
import axios from 'axios';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';


const API_URL = process.env.API_URL;
console.log(API_URL)

async function verifyPwd(email: string, password: string): Promise<string> {
  try {
    const result = await axios.post(`${API_URL}/v1/auth/login`, {
      email,
      password
    });
    if (result.status == 200) {
      const { token } = result.data.data;
      console.log("token = ", token)
      return token;
    }
  } catch (error) {
    console.log('error', error);
  }
}

async function getUser(token): Promise<any> {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    };
    return fetch(`${API_URL}/v1/userinfo`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.code == 200) {
          const user = result.data;
          console.log("user = ", user)
          return user;
        }
        return null;
      }).catch(error => console.log('error', error));
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
export const { handlers, auth, signIn, signOut, } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  providers: [
    // 增加一个CredentialsProvider，还可以是google provider，oauth等等
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        if (parsedCredentials.success) {
          let { email, password } = parsedCredentials.data;
          const token = await verifyPwd(email, password);
          const user = await getUser(token);
          if (!user) {
            console.log('authorize: Invalid credentials');
            return null;
          }
          return user;
        }
        console.log('authorize: parsedCredentials failed');
        return null;
      },
    })],
});