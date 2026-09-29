export function canAccessCandidateArea(session) {
  return Boolean(session) && isCandidateRole(session?.user?.role)
}

export function isCandidateRole(role) {
  return typeof role === "string" && role.toUpperCase() === "CANDIDATE"
}

export function requiresCandidateRole(pathname) {
  return pathname === "/candidate" || pathname.startsWith("/candidate/")
}

export function getRequestErrorMessage(error, { forbidden, fallback }) {
  if (error?.response?.status === 403) return forbidden

  const message = error?.response?.data?.message
  return typeof message === "string" && message ? message : fallback
}
