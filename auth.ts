import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { User } from './app/lib/definitions';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({
    credentials: null,
    async authorize(credentials) {
      console.log(credentials);
      const { email, password } = credentials;
      const user = await getUser(email);
      if (!user) { return null; }
      const passwordsMatch = await bcrypt.compare(password, user.password);
      if (passwordsMatch) { return user; }
      console.log('Invalid credentials');
      return null;
    },
  })],
});