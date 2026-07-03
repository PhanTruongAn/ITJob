import axiosInstance from "../config/axios"
import { PATH_API } from "./constants/apiPath"

import { IBackendRes } from "../types/backend"

export interface EmailAnalyticsSummary {
  from: string
  to: string
  sent: number
  failed: number
  pending: number
  total: number
}

export interface EmailAnalyticsRecord {
  id: number
  recommendationId: number
  email: string
  status: "SENT" | "FAILED" | "PENDING"
  attempt: number
  createdAt: string
  errorMessage: string | null
}

export async function fetchEmailAnalyticsSummary(
  from?: string,
  to?: string,
): Promise<EmailAnalyticsSummary> {
  const response = await axiosInstance.get<IBackendRes<EmailAnalyticsSummary>>(
    PATH_API.emailAnalytics.summary,
    { params: { from, to, format: "json" } },
  )
  return response.data.data
}

export async function fetchEmailAnalyticsRecords(
  from?: string,
  to?: string,
): Promise<EmailAnalyticsRecord[]> {
  const response = await axiosInstance.get<IBackendRes<EmailAnalyticsRecord[]>>(
    PATH_API.emailAnalytics.records,
    { params: { from, to, format: "json" } },
  )
  return response.data.data
}

export function downloadEmailAnalyticsCsv(type: "summary" | "records", from?: string, to?: string) {
  const url = type === "summary"
    ? PATH_API.emailAnalytics.summary
    : PATH_API.emailAnalytics.records

  const params: Record<string, string> = { format: "csv" }
  if (from) params.from = from
  if (to) params.to = to

  const link = document.createElement("a")
  
  axiosInstance.get(url, {
    params,
    responseType: "blob",
  })
    .then((response) => {
      const blob = response.data
      const objectUrl = URL.createObjectURL(blob)
      link.href = objectUrl
      link.download = `email_analytics_${type}.csv`
      link.click()
      URL.revokeObjectURL(objectUrl)
    })
    .catch((error) => {
      console.error("Failed to download CSV:", error)
    })
}
