import { Box } from "@mui/material";
import { SessionHistory } from "./SessionHistory";
import { useMasters } from "../../hooks/useMasters";

export const History = () => {
  const { masterData } = useMasters();
  return (
    <Box>
      <h2>セッション履歴</h2>
      {masterData && <SessionHistory master={masterData} />}
    </Box>
  );
};
