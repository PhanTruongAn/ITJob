import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { message } from "antd"
import { useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import { CACHE_TIME, STALE_TIME } from "./common/constants"
import MotionLazyContainer from "./components/animate/MotionLazyContainer"
import { useAppDispatch } from "./redux/hooks"
import { getAccount } from "./redux/slice/accountSlice"
import Router from "./routes"
import "./styles/App.css"

function App() {
  const dispatch = useAppDispatch()
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        gcTime: CACHE_TIME,
        staleTime: STALE_TIME,
      },
    },
  })
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
    <>
      <MotionLazyContainer>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </QueryClientProvider>
      </MotionLazyContainer>
    </>
  )
}

export default App
