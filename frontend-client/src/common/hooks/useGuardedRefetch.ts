import { useCallback, useRef, useState } from "react"

export default function useGuardedRefetch(
  refetch: () => Promise<unknown>,
  isFetching: boolean,
) {
  const requestInFlight = useRef(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefetch = useCallback(async () => {
    if (isFetching || requestInFlight.current) return
    requestInFlight.current = true
    setIsRefreshing(true)
    try {
      return await refetch()
    } finally {
      requestInFlight.current = false
      setIsRefreshing(false)
    }
  }, [isFetching, refetch])

  return { handleRefetch, isBusy: isFetching || isRefreshing }
}
