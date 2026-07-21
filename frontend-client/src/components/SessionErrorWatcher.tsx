"use client"
import { useSession, signOut } from "next-auth/react"
import { useEffect } from "react"

export default function SessionErrorWatcher() {
  const { data: session } = useSession()

  useEffect(() => {
    if ((session as any)?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/signin" })
    }
  }, [session])

  return null
}
