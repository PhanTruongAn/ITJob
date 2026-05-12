import { useUpdateState } from "@/common/utils/hooksState"
import { useState } from "react"
import { ProfileState } from "./interfaces"

export const useProfileState = () => {
  const [state, setState] = useState<ProfileState>({
    name: "",
    phone: "",
    address: "",
    avatar: "",
  })
  const updateState = useUpdateState(setState)

  return { state, updateState }
}
