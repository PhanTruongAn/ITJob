import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConfigProvider, message } from "antd"
import enUS from "antd/locale/en_US"
import viVN from "antd/locale/vi_VN"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { BrowserRouter } from "react-router-dom"
import { CACHE_TIME, STALE_TIME } from "./common/constants"
import MotionLazyContainer from "./components/animate/MotionLazyContainer"
import "./i18n/config"
import { useAppDispatch } from "./redux/hooks"
import { getAccount } from "./redux/slice/accountSlice"
import Router from "./routes"
import "./styles/App.css"

function App() {
  const { i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const antdLocale = i18n.language?.startsWith("en") ? enUS : viVN

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            gcTime: CACHE_TIME,
            staleTime: STALE_TIME,
            retry: (failureCount, error) => {
              const status =
                (error as { response?: { status?: number } }).response?.status ??
                (error as { statusCode?: number }).statusCode
              if (status !== undefined && status >= 400 && status < 500) return false
              return failureCount < 1
            },
          },
        },
      }),
  )
  useEffect(() => {
    message.config({
      top: 50,
      duration: 2,
      maxCount: 3,
    })
  }, [])
  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (token) {
      dispatch(getAccount())
    }
  }, [dispatch])
  return (
    <ConfigProvider locale={antdLocale}>
      <MotionLazyContainer>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </QueryClientProvider>
      </MotionLazyContainer>
    </ConfigProvider>
  )
}

export default App
