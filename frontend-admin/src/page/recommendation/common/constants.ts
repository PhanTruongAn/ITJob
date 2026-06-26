export const RECOMMENDATION_STATUS = {
  PENDING: "PENDING",
  SENT: "SENT",
  FAILED: "FAILED",
} as const

export const STATUS_COLORS: Record<string, string> = {
  PENDING: "gold",
  SENT: "blue",
  FAILED: "red",
}

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  SENT: "Sent",
  FAILED: "Failed",
}
