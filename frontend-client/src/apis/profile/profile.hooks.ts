import CustomHooks from "@/common/hooks/customHooks"
import { useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { profileApi } from "./profile.api"
import { useRouter } from "next/navigation"

// --- UPDATE ---
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const { update } = useSession()
  const router = useRouter()
  return CustomHooks.useMutation(profileApi.update, {
    onSuccess: async (res, variables) => {
      await update({
        name: variables.name,
        phone: variables.phone,
        address: variables.address,
      })
      router.refresh()
    },
  })
}
