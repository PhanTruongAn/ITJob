import { useState, useCallback } from "react"

export const useUpdateState = <T>(initialState: T) => {
  const [state, setState] = useState<T>(initialState)

  const updateState = useCallback((newState: Partial<T>) => {
    setState((prev) => ({ ...prev, ...newState }))
  }, [])

  return { state, updateState }
}
