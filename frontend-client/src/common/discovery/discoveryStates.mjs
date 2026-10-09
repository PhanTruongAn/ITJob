export function getDiscoveryViewState({ isLoading, isError, items }) {
  if (isLoading) return "loading"
  if (isError) return "error"
  return items.length > 0 ? "results" : "empty"
}

export function getJobDetailFailureState(error) {
  return error?.response?.status === 404 ? "notFound" : "error"
}
