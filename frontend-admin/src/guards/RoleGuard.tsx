import { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAppSelector } from "../redux/hooks"
import { getManagementLandingPath, PATH_AUTH } from "../routes/paths"

export default function RoleGuard({
  roles,
  children,
}: {
  roles: string[]
  children: ReactNode
}) {
  const roleName = useAppSelector((state) => state.account.user.role?.name)
  if (roleName && roles.includes(roleName.toUpperCase())) return <>{children}</>

  return <Navigate to={getManagementLandingPath(roleName) ?? PATH_AUTH.login} replace />
}
