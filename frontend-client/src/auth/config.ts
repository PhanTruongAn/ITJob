import { ACCESS_TOKEN_VALIDITY, REFRESH_TOKEN_VALIDITY } from "@/constants/auth"
import { UserNextAuth } from "@/types/backend"
import axios from "axios"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

// axios dùng riêng cho login + refresh (KHÔNG có interceptor)
const axiosAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<UserNextAuth | null> {
        try {
          const res = await axiosAuth.post("/api/v1/auth/login", {
            username: credentials?.username,
            password: credentials?.password,
          })

          const data = res.data?.data

          if (data?.access_token && data?.refresh_token) {
            return {
              id: String(data.user.id),
              name: data.user.name || credentials?.username,
              email: credentials?.username as string,
              image: data.user.avatar || null,
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
            }
          }

          return null
        } catch (err) {
          console.error("Credentials login error:", err)
          return null
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: REFRESH_TOKEN_VALIDITY,
  },

  secret: process.env.AUTH_SECRET,

  callbacks: {
    async jwt({ token, user, account }) {
      /**
       * LOGIN LẦN ĐẦU
       */
      if (user && account?.provider === "credentials") {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.userId = user.id
        token.name = user.name ?? ""
        token.email = user.email ?? ""
        token.image = user.image
        token.accessTokenExpires = Date.now() + ACCESS_TOKEN_VALIDITY

        return token
      }

      /**
       * GOOGLE LOGIN
       */
      if (account?.provider === "google" && account.id_token) {
        try {
          const res = await axiosAuth.post("/api/v1/auth/google", {
            idToken: account.id_token,
          })

          const data = res.data?.data

          if (data?.access_token && data?.refresh_token) {
            token.accessToken = data.access_token
            token.refreshToken = data.refresh_token
            token.userId = String(data.user?.id)
            token.name = data.user?.name
            token.email = data.user?.email
            token.image = data.user?.avatar
            token.accessTokenExpires = Date.now() + ACCESS_TOKEN_VALIDITY
          }

          return token
        } catch (err) {
          console.error("Google backend login error:", err)
          return token
        }
      }

      /**
       * Nếu chưa có access token → return
       */
      if (!token.accessToken) {
        return token
      }

      /**
       * Nếu token còn hạn → return luôn
       */
      if (
        token.accessTokenExpires &&
        Date.now() < (token.accessTokenExpires as number)
      ) {
        return token
      }

      /**
       * Nếu không có refreshToken → logout
       */
      if (!token.refreshToken) {
        return {
          ...token,
          accessToken: undefined,
          refreshToken: undefined,
          accessTokenExpires: undefined,
          error: "RefreshTokenMissing",
        }
      }

      /**
       * REFRESH TOKEN
       */
      try {
        const res = await axiosAuth.post("/api/v1/auth/refresh", {
          refreshToken: token.refreshToken,
        })

        const data = res.data?.data

        if (data?.access_token) {
          token.accessToken = data.access_token
          token.refreshToken = data.refresh_token ?? token.refreshToken
          token.accessTokenExpires = Date.now() + ACCESS_TOKEN_VALIDITY

          console.log("Access token refreshed")

          return token
        }

        return {
          ...token,
          error: "RefreshAccessTokenError",
        }
      } catch (err) {
        console.error("Refresh token error:", err)

        return {
          ...token,
          accessToken: undefined,
          refreshToken: undefined,
          accessTokenExpires: undefined,
          error: "RefreshAccessTokenError",
        }
      }
    },

    async session({ session, token }) {
      if (token.error) {
        session.error = token.error as string
      }

      session.accessToken = token.accessToken as string | undefined
      session.refreshToken = token.refreshToken as string | undefined

      session.user.id = token.userId as string
      session.user.name = token.name as string
      session.user.email = token.email as string
      session.user.image = token.image as string | undefined

      return session
    },
  },
})
