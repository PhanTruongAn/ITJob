import axiosInstance from "@/configs/axiosInstance"
import { ACCESS_TOKEN_VALIDITY, REFRESH_TOKEN_VALIDITY } from "@/constants/auth"
import { UserNextAuth } from "@/types/backend"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      token: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<UserNextAuth | null> => {
        try {
          const res = await axiosInstance.post("/api/v1/auth/login", {
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

  session: { strategy: "jwt", maxAge: REFRESH_TOKEN_VALIDITY },
  secret: process.env.AUTH_SECRET,

  callbacks: {
    async jwt({ token, user, account }) {
      // -------- First login ----------
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.userId = user.id
        token.name = user?.name ?? ""
        token.email = user?.email ?? ""
        token.image = user.image
        token.accessTokenExpires = Date.now() + ACCESS_TOKEN_VALIDITY
      }

      // -------- Google login ----------
      if (account?.provider === "google" && account?.id_token) {
        try {
          const res = await axiosInstance.post("/api/v1/auth/google", {
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
        } catch (err: any) {
          console.error("Google backend login error:", err)
        }
      }

      // -------- Auto refresh logic ----------
      if (
        token.accessTokenExpires &&
        Date.now() > token.accessTokenExpires - 60 * 1000
      ) {
        // accessToken gần hết hạn (<1 phút)
        try {
          const res = await axiosInstance.post("/api/v1/auth/refresh", {
            refreshToken: token.refreshToken,
          })
          const data = res.data?.data
          if (data?.access_token) {
            token.accessToken = data.access_token
            token.refreshToken = data.refresh_token
            token.accessTokenExpires = Date.now() + ACCESS_TOKEN_VALIDITY

            console.log("Refreshed tokens successfully")
          }
        } catch (err: any) {
          console.error("Error refreshing access token:", err)
          // Xóa token nếu refresh fail
          token.accessToken = undefined
          token.refreshToken = undefined
        }
      }

      return token
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      session.user.id = token.userId as string
      session.user.name = token.name as string
      session.user.email = token.email as string
      session.user.image = token.image as string
      return session
    },
  },
})
