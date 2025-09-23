import { compare } from 'bcrypt-ts';
import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { createGuestUser, getUser } from '@/lib/db/queries';
import { authConfig } from './auth.config';
import { DUMMY_PASSWORD } from '@/lib/constants';
import type { DefaultJWT } from 'next-auth/jwt';

export type UserType = 'guest' | 'regular';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      type: UserType;
    } & DefaultSession['user'];
  }

  interface User {
    id?: string;
    email?: string | null;
    type: UserType;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    type: UserType;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        console.log('Authenticating user:', email);
        const users = await getUser(email);
        console.log('Users found:', users.length);

        if (users.length === 0) {
          console.log('User not found, comparing with dummy password');
          await compare(password, DUMMY_PASSWORD);
          return null;
        }

        const [user] = users;
        console.log('User found:', user.id);

        if (!user.password) {
          console.log('User has no password, comparing with dummy password');
          await compare(password, DUMMY_PASSWORD);
          return null;
        }

        const passwordsMatch = await compare(password, user.password);
        console.log('Password match:', passwordsMatch);

        if (!passwordsMatch) return null;

        console.log('Authentication successful for user:', user.id);
        return { ...user, type: 'regular' };
      },
    }),
    Credentials({
      id: 'guest',
      credentials: {},
      async authorize() {
        console.log('Creating guest user');
        const [guestUser] = await createGuestUser();
        console.log('Guest user created:', guestUser.id);
        return { ...guestUser, type: 'guest' };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT callback - token:', token ? 'Exists' : 'Missing', 'user:', user ? 'Exists' : 'Missing');
      if (user) {
        token.id = user.id as string;
        token.type = user.type;
      }

      return token;
    },
    async session({ session, token }) {
      console.log('Session callback - session:', session ? 'Exists' : 'Missing', 'token:', token ? 'Exists' : 'Missing');
      if (session.user) {
        session.user.id = token.id;
        session.user.type = token.type;
      }

      return session;
    },
  },
});
