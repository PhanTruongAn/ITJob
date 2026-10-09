"use client"

import CustomHooks from "@/common/hooks/customHooks"
import { QUERY_KEYS } from "@/common/queryKeys"
import { isCandidateRole } from "@/common/security/frontendSecurity.mjs"
import { getMyResumes } from "@/apis/resume"
import { IResume } from "@/types/backend"
import { useSession } from "next-auth/react"

export const myResumesQueryKey = (candidateId?: string | number) =>
  [QUERY_KEYS.USER_MODULE, "my-resumes", candidateId ?? "anonymous"] as const

export function useMyResumes() {
  const { data: session, status: sessionStatus } = useSession()
  const candidateId = session?.user?.id
  const hasCandidateAccess =
    sessionStatus === "authenticated" &&
    !!candidateId &&
    isCandidateRole(session?.user?.role)

  const query = CustomHooks.useQuery<IResume[]>(
    myResumesQueryKey(candidateId),
    async () => {
      const response = await getMyResumes()
      if (!Array.isArray(response.data)) {
        throw new Error("Candidate applications response was invalid")
      }
      return response.data
    },
    {
      enabled: hasCandidateAccess,
      staleTime: 30_000,
      placeholderData: undefined,
    },
  )

  return { ...query, session, sessionStatus, hasCandidateAccess }
}
