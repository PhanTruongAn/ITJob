export type AppStatus =
  | "hired"
  | "interviewing"
  | "reviewing"
  | "not_selected"
  | "applied"

export interface StatusDetail {
  label: string
  color: string
  bg: string
}

export const statusConfig: Record<AppStatus, StatusDetail> = {
  hired: { label: "Hired", color: "#166534", bg: "#dcfce7" },
  interviewing: { label: "Interviewing", color: "#1e3a8a", bg: "#e0e7ff" },
  reviewing: { label: "Reviewing", color: "#334155", bg: "#f1f5f9" },
  not_selected: { label: "Not Selected", color: "#991b1b", bg: "#fee2e2" },
  applied: { label: "Applied", color: "#0369a1", bg: "#e0f2fe" },
}
