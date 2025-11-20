import axiosInstance from "@/app/configs/axiosInstance"
import { UserNextAuth } from "@/app/types/backend"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
// import axiosInstance from "../configs/axiosInstance"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // Google login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      token: true, // để lấy id_token
    }),

    // Credentials login (email/password)
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

          const data = res.data
          if (res.status === 200 && data?.data?.access_token) {
            // Trả về user object để lưu vào token & session
            return {
              id: credentials?.username as string,
              accessToken: data.data.access_token,
              name: credentials?.username as string,
            }
          }
          return null
        } catch (err) {
          console.error("Login credentials lỗi:", err)
          return null
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.AUTH_SECRET,

  callbacks: {
    async jwt({ token, account, profile }) {
      console.log("JWT CALLBACK – account:", account?.provider)

      // Google login
      if (account?.provider === "google" && account?.id_token) {
        console.log("Google login – gọi backend")

        try {
          const backendUrl = process.env.BACKEND_URL || "http://localhost:8080"
          const res = await fetch(`${backendUrl}/api/v1/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: account.id_token }),
          })

          if (res.ok) {
            const { data } = await res.json()
            token.backendToken = data.access_token
            token.userId = data.user?.id
            token.name = data.user?.name
          }
        } catch (err: any) {
          console.error("Backend Google fetch error:", err.message)
        }
      }

      // Credentials login
      if (account?.provider === "credentials") {
        ;(token.backendToken = token.accessToken as string),
          (token.userId = token.id as string),
          (token.name = token.name)
      }

      return token
    },

    async session({ session, token }) {
      // Gán token backend vào session
      if (token.backendToken) session.accessToken = token.backendToken as string
      if (token.userId) session.user.id = token.userId as string
      if (token.name) session.user.name = token.name as string

      return session
    },
  },
})
