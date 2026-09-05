import * as React from "react"
import { useTranslation } from "react-i18next"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import OutlinedInput from "@mui/material/OutlinedInput"

interface ForgotPasswordProps {
  open: boolean
  handleClose: () => void
}

export default function ForgotPassword({
  open,
  handleClose,
}: ForgotPasswordProps) {
  const { t } = useTranslation()
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          handleClose()
        },
        sx: { backgroundImage: "none" },
      }}
    >
      <DialogTitle>{t("auth.resetPasswordTitle", "Reset password")}</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      >
        <DialogContentText>
          {t("auth.resetPasswordDesc", "Enter your account's email address, and we'll send you a link to reset your password.")}
        </DialogContentText>
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          label={t("auth.email", "Email")}
          placeholder={t("auth.email", "Email")}
          type="email"
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>{t("common.cancel", "Cancel")}</Button>
        <Button variant="contained" type="submit">
          {t("auth.continue", "Continue")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
