// src/types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    accessToken?: string // JWT từ backend Java của bạn
    user: {
      id: string // thêm id user (Google không trả id mặc định)
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    accessToken?: string
    image?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    backendToken?: string
    userId?: string
  }
}
