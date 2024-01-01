import React, { useState } from "react";
import {
  ConfirmDialog as ConfirmDialogComponent,
  ConfirmDialogResult,
} from "../components/dialogs/ConfirmDialog";

export const useConfirmDialog = () => {
  const [open, setOpen] = useState(false);
  const [resolve, setResolve] =
    useState<(value: ConfirmDialogResult) => void>();

  const openConfirmDialog = () => {
    setOpen(true);
    return new Promise<ConfirmDialogResult>((resolve) => {
      setResolve(() => resolve);
    });
  };

  const onClose = (result: ConfirmDialogResult) => {
    setOpen(false);
    if (resolve) {
      resolve(result);
    }
  };

  const ConfirmDialog: React.FC<{ title: string; message: string }> = (
    props
  ) => (
    <ConfirmDialogComponent
      open={open}
      onClose={onClose}
      title={props.title}
      message={props.message}
    />
  );

  return {
    ConfirmDialog,
    openConfirmDialog,
  };
};
