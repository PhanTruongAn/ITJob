import { ReactNode, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import LoadingScreen from "../components/LoadingScreen"
import { useAppSelector } from "../redux/hooks"
import { PATH_AUTH } from "../routes/paths"

export interface AuthGuardProp {
  children: ReactNode
}

export default function AuthGuard({ children }: AuthGuardProp) {
  const { pathname } = useLocation()

  const [requestedLocation, setRequestedLocation] = useState<string | null>(
    null
  )

  const { isAuthenticated, isLoading } = useAppSelector(
    (state) => state.account
  )
  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname)
    }
    return <Navigate to={PATH_AUTH.login} state={{ from: pathname }} replace />
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null)
    return <Navigate to={requestedLocation} />
  }

  return <>{children}</>
}
