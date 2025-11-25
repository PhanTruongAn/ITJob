import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    refreshToken?: string
    error?: string
    user: {
      id: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    accessToken?: string
    refreshToken?: string
    image?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string
    accessTokenExpires?: number
    refreshToken?: string
    userId?: string
    name?: string
    email?: string
    image?: string
  }
}
