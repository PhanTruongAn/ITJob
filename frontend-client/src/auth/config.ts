import axiosInstance from "@/app/configs/axiosInstance"
import { UserNextAuth } from "@/app/types/backend"
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
          if (data?.access_token) {
            return {
              id: data.user.id,
              name: data.user.name || credentials?.username,
              email: credentials?.username as string,
              image: data.user.avatar || null,
              accessToken: data.access_token,
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

  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,

  callbacks: {
    async jwt({ token, account, user }) {
      console.log("JWT CALLBACK – provider:", account?.provider)

      // ******** GOOGLE LOGIN ********
      if (account?.provider === "google" && account?.id_token) {
        try {
          const res = await axiosInstance.post("/api/v1/auth/google", {
            idToken: account.id_token,
          })

          const data = res.data?.data
          if (data?.access_token) {
            token.backendToken = data.access_token
            token.userId = String(data.user?.id)
            token.name = data.user?.name
          }
        } catch (err: any) {
          console.error("Google backend login error:", err)
        }
      }

      // ******** CREDENTIALS LOGIN ********
      if (account?.provider === "credentials" && user) {
        token.backendToken = user.accessToken
        token.userId = user.id
        token.name = user.name || user.email
        token.email = user.email
        token.image = user.image
      }

      return token
    },

    async session({ session, token }) {
      if (token.backendToken) session.accessToken = token.backendToken as string

      if (token.userId) session.user.id = token.userId as string

      if (token.name) session.user.name = token.name as string

      return session
    },
  },
})
