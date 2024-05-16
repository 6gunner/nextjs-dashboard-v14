import { auth } from "@/auth";

// 这个auth方法其实是callbacks.authorized()实现的
// export default auth((req) => {
//   // req.auth
//   console.log(`req.auth = ${req.auth}`)
// })
export default auth;


export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|favicon\.ico).*)'],
};