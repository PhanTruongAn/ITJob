// app/Providers.tsx
"use client"

import { store } from "@/redux/store"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools" // đúng v5
import { SessionProvider } from "next-auth/react"
import { useState } from "react"
import { Provider as ReduxProvider } from "react-redux"

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 1000 * 60 * 60 * 24,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <ReduxProvider store={store}>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </SessionProvider>
    </ReduxProvider>
  )
}
