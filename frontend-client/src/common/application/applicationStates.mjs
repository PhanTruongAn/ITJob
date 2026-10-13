import { isCandidateRole } from "../security/frontendSecurity.mjs"

export function getApplyActionState({ sessionStatus, role, checkState }) {
  if (sessionStatus === "loading") return "sessionLoading"
  if (sessionStatus === "unauthenticated") return "guest"
  if (sessionStatus !== "authenticated" || !isCandidateRole(role)) return "hidden"
  if (checkState === "applied") return "applied"
  if (checkState === "notApplied") return "ready"
  if (checkState === "error") return "error"
  return "checking"
}

export function getAppliedCheckState(response) {
  if (response?.data === null) return "notApplied"
  if (response?.data && typeof response.data === "object") return "applied"
  return "error"
}

export function getListResponseState(response) {
  if (!Array.isArray(response?.data)) {
    return { state: "error", items: [] }
  }

  return {
    state: response.data.length === 0 ? "empty" : "available",
    items: response.data,
  }
}
