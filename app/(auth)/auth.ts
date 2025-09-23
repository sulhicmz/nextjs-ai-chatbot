import { compare } from 'bcrypt-ts';
import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { createGuestUser, getUser } from '@/lib/db/queries';
import { authConfig } from './auth.config';
import { DUMMY_PASSWORD } from '@/lib/constants';
import type { DefaultJWT } from 'next-auth/jwt';
import { debugLog } from '@/lib/debug';

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
        debugLog('Authenticating user:', email);
        const users = await getUser(email);
        debugLog('Users found:', users.length);

        if (users.length === 0) {
          debugLog('User not found, comparing with dummy password');
          await compare(password, DUMMY_PASSWORD);
          return null;
        }

        const [user] = users;
        debugLog('User found:', user.id);

        if (!user.password) {
          debugLog('User has no password, comparing with dummy password');
          await compare(password, DUMMY_PASSWORD);
          return null;
        }

        const passwordsMatch = await compare(password, user.password);
        debugLog('Password match:', passwordsMatch);

        if (!passwordsMatch) return null;

        debugLog('Authentication successful for user:', user.id);
        return { ...user, type: 'regular' };
      },
    }),
    Credentials({
      id: 'guest',
      credentials: {},
      async authorize() {
        debugLog('Creating guest user');
        const [guestUser] = await createGuestUser();
        debugLog('Guest user created:', guestUser.id);
        return { ...guestUser, type: 'guest' };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      debugLog(
        'JWT callback - token:',
        token ? 'Exists' : 'Missing',
        'user:',
        user ? 'Exists' : 'Missing',
      );
      if (user) {
        token.id = user.id as string;
        token.type = user.type;
      }

      return token;
    },
    async session({ session, token }) {
      debugLog(
        'Session callback - session:',
        session ? 'Exists' : 'Missing',
        'token:',
        token ? 'Exists' : 'Missing',
      );
      if (session.user) {
        session.user.id = token.id;
        session.user.type = token.type;
      }

      return session;
    },
  },
});
