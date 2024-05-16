import type { NextAuthConfig } from 'next-auth';


export const authConfig = {
  // 配置需要登录的页面
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    /**
     * 中间件里会用到
     * @params.auth	 The authenticated user or token, if any.
     * @params.request	The request to be authorized.
     * @returns 
     */
    async authorized({ auth, request }) {
      const isLogined = !!auth?.user;
      const pathname = request.nextUrl.pathname
      console.log(`isLogined = ${isLogined}, pathname = ${pathname}`)
      const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard');
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
    },
    // 任何在这里返回的，都会保存在jwt里，并且传递给session;
    async jwt({ token, user, trigger }) {
      console.log(`trigger = ${JSON.stringify(trigger)}`)
      if (user) {
        token.user = user;
      }
      return token;
    },
    // 继承session，修改一下值
    async session({ session, token }) {
      console.log(`token = ${JSON.stringify(token)}`)
      session.user = token.user;
      return session
    },
  },
  providers: [], // Add providers with an empty array for now

} satisfies NextAuthConfig