export function assertApiSuccess(response) {
  if (
    response &&
    typeof response === "object" &&
    "statusCode" in response &&
    typeof response.statusCode === "number" &&
    response.statusCode >= 400
  ) {
    const error = new Error(
      typeof response.message === "string" && response.message
        ? response.message
        : "The request failed",
    )
    Object.assign(error, { statusCode: response.statusCode })
    throw error
  }
  return response
}

export function shouldRetryQuery(failureCount, error) {
  const status = error?.response?.status ?? error?.statusCode
  if (status >= 400 && status < 500) return false
  return failureCount < 1
}
