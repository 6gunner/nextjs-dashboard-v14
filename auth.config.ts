import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLogined = !!auth.user;
      const isOnDashboard = request.nextUrl.pathname.startWith('/dashboard');
      if (isOnDashboard) {
        if (isLogined) {
          return true;
        }
        return false;
      } else if (isLogined) {
        // 已登录，从login跳转到dashboard
        return Response.redirect(new URL('/dashboard', request.nextUrl));
      }
      return true;
    }
  },
  providers: [], // Add providers with an empty array for now

} satisfies NextAuthConfig