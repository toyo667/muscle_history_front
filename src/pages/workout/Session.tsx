import { Box, Button } from "@mui/material";
import React, { useCallback } from "react";
import { useConfirmDialog } from "../../hooks/useConfirmDialog";
import { MasterData } from "../../hooks/useMasters";
import { WorkoutSession, WorkoutSessionApiFactory } from "../../openapi";
import { api } from "../../utils/apis";
import { WorkoutContent } from "./WorkoutContent";

interface Props {
  endSessionCallback: () => void;
  masterData: MasterData;
  activeSession: WorkoutSession;
}

export const Session: React.FC<Props> = ({
  endSessionCallback,
  masterData,
  activeSession,
}) => {
  const { ConfirmDialog, openConfirmDialog } = useConfirmDialog();

  const endSession = useCallback(async () => {
    if (!activeSession.id) return;

    const res = await openConfirmDialog(); // 確認ダイアログ
    if (res === "confirm") {
      await api(WorkoutSessionApiFactory).v1WorkoutSessionPartialUpdate(
        activeSession.id,
        {
          finished_at: new Date().toISOString(),
        }
      );
      endSessionCallback();
    }
  }, [activeSession.id, endSessionCallback, openConfirmDialog]);

  return (
    <Box>
      <h2>セッション実行中</h2>
      <Box>
        <Button onClick={endSession}>セッションを終了する</Button>
        <WorkoutContent masterData={masterData} sessionId={activeSession.id} />
        <ConfirmDialog
          title="確認ダイアログ"
          message="セッションを終了します。よろしいですか？"
        />
      </Box>
    </Box>
  );
};
