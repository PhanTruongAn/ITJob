"use client"

import BookmarkIcon from "@mui/icons-material/Bookmark"
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"
import { Alert, Button, CircularProgress, IconButton, Snackbar } from "@mui/material"
import { SxProps, Theme } from "@mui/material/styles"
import { isCandidateRole } from "@/common/security/frontendSecurity.mjs"
import {
  BookmarkKind,
  useSavedItemIndex,
  useToggleSavedItem,
} from "@/apis/bookmark/bookmark.hooks"
import { ISavedCompany, ISavedJob } from "@/apis/bookmark/bookmark.types"
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { MouseEvent, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

interface SavedItemButtonProps {
  kind: BookmarkKind
  resourceId: number
  savedRecordOverride?: ISavedJob | ISavedCompany
  showLabel?: boolean
  sx?: SxProps<Theme>
}

export default function SavedItemButton({
  kind,
  resourceId,
  savedRecordOverride,
  showLabel = false,
  sx,
}: SavedItemButtonProps) {
  const { t } = useTranslation()
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const savedItemsQuery = useSavedItemIndex(kind, !savedRecordOverride)
  const mutation = useToggleSavedItem(kind)
  const submitting = useRef(false)
  const [overrideWasRemoved, setOverrideWasRemoved] = useState(false)
  const [feedback, setFeedback] = useState<{
    open: boolean
    message: string
    severity: "success" | "error"
  }>({ open: false, message: "", severity: "success" })

  const isCandidate = isCandidateRole(session?.user?.role)
  const indexedRecord =
    kind === "job"
      ? (savedItemsQuery.data as ISavedJob[] | undefined)?.find(
          (saved) => saved.job.id === resourceId,
        )
      : (savedItemsQuery.data as ISavedCompany[] | undefined)?.find(
          (saved) => saved.company.id === resourceId,
        )
  const savedRecord = indexedRecord ?? (overrideWasRemoved ? undefined : savedRecordOverride)
  const isSaved = Boolean(savedRecord)
  const busy = mutation.isPending || savedItemsQuery.isLoading || status === "loading"
  const mutationDisabled =
    busy || (status === "authenticated" && (!isCandidate || savedItemsQuery.isError))
  const labelKey = isSaved
    ? kind === "job" ? "bookmarks.removeJob" : "bookmarks.removeCompany"
    : kind === "job" ? "bookmarks.saveJob" : "bookmarks.saveCompany"

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (status === "unauthenticated") {
      router.push(`/signin?callbackUrl=${encodeURIComponent(pathname || "/")}`)
      return
    }
    if (status !== "authenticated" || !isCandidate || savedItemsQuery.isError || submitting.current) {
      return
    }

    submitting.current = true
    mutation.mutate(
      { resourceId, savedRecord },
      {
        onSuccess: () => {
          setOverrideWasRemoved(Boolean(savedRecord))
          setFeedback({
            open: true,
            message: t(
              isSaved
                ? kind === "job" ? "bookmarks.jobRemoved" : "bookmarks.companyRemoved"
                : kind === "job" ? "bookmarks.jobSaved" : "bookmarks.companySaved",
            ),
            severity: "success",
          })
        },
        onError: () => {
          setFeedback({
            open: true,
            message: t(kind === "job" ? "bookmarks.jobError" : "bookmarks.companyError"),
            severity: "error",
          })
        },
        onSettled: () => {
          submitting.current = false
        },
      },
    )
  }

  if (status === "authenticated" && !isCandidate) return null

  const buttonLabel = t(labelKey)
  const ariaLabel = savedItemsQuery.isError && status === "authenticated"
    ? t("bookmarks.stateError")
    : buttonLabel
  const icon = busy
    ? <CircularProgress size={20} />
    : isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />

  return (
    <>
      {showLabel ? (
        <Button
          onClick={handleClick}
          disabled={mutationDisabled}
          aria-label={ariaLabel}
          startIcon={icon}
          sx={sx}
        >
          {buttonLabel}
        </Button>
      ) : (
        <IconButton
          onClick={handleClick}
          disabled={mutationDisabled}
          aria-label={ariaLabel}
          title={ariaLabel}
          color={isSaved ? "primary" : "default"}
          sx={sx}
        >
          {icon}
        </IconButton>
      )}
      <Snackbar
        open={feedback.open}
        autoHideDuration={4000}
        onClose={() => setFeedback((current) => ({ ...current, open: false }))}
      >
        <Alert
          severity={feedback.severity}
          variant="filled"
          onClose={() => setFeedback((current) => ({ ...current, open: false }))}
          sx={{ width: "100%" }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </>
  )
}
