import CustomHooks from "@/common/hooks/customHooks"
import { useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { profileApi } from "./profile.api"

// --- UPDATE ---
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const { update } = useSession()
  return CustomHooks.useMutation(profileApi.update, {
    onSuccess: async () => {
      await update()
    },
  })
}
