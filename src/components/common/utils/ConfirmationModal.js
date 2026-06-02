import React from "react";
import {
  Modal,
  ModalDialog,
  Typography,
  Button,
  Stack,
  Box,
} from "@mui/joy";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  color = "danger",
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        sx={{
          borderRadius: "xl",
          boxShadow: "lg",
          width: 400,
          maxWidth: "95vw",
          p: 3,
        }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start", mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "full",
              bgcolor: color === "danger" ? "danger.100" : "warning.100",
              color: color === "danger" ? "danger.600" : "warning.600",
              flexShrink: 0,
            }}
          >
            <WarningRoundedIcon />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography level="title-lg" sx={{ fontWeight: "700", mb: 0.5 }}>
              {title}
            </Typography>
            <Typography level="body-md" textColor="text.secondary">
              {message}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1.5} sx={{ justifyContent: "flex-end", mt: 1 }}>
          <Button
            variant="plain"
            color="neutral"
            onClick={onClose}
            disabled={isLoading}
            sx={{ borderRadius: "lg", fontWeight: "600" }}
          >
            {cancelText}
          </Button>
          <Button
            variant="solid"
            color={color}
            loading={isLoading}
            onClick={onConfirm}
            sx={{ borderRadius: "lg", fontWeight: "600" }}
          >
            {confirmText}
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
