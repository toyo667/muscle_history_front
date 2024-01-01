import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

export type ConfirmDialogResult = "confirm" | "cancel";

type ConfirmDialogProps = {
  open: boolean;
  onClose: (result: ConfirmDialogResult) => void;
  title: string;
  message: string;
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  title,
  message,
}) => (
  <Dialog open={open} onClose={() => onClose("cancel")}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => onClose("cancel")} variant="outlined">
        キャンセル
      </Button>
      <Button onClick={() => onClose("confirm")} autoFocus>
        確認
      </Button>
    </DialogActions>
  </Dialog>
);
