'use server';

// 引入next-auth的signIn方法，也可以自己定义一个。
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { msg: "Invalid credentials", status: "error" };
        default:
          return { msg: "Something went wrong", status: "error" };
      }
    }
    throw error;
  }
}