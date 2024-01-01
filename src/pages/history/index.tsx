import { Box } from "@mui/material";
import { SessionHistory } from "./SessionHistory";
import { useMasters } from "../../hooks/useMasters";
import { RequiredAuth } from "../../utils/requiredAuth";

const History = () => {
  const { masterData } = useMasters();
  return (
    <Box>
      <h2>セッション履歴</h2>
      {masterData && <SessionHistory master={masterData} />}
    </Box>
  );
};

export default RequiredAuth(History);
