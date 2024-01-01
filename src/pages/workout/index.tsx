import { Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMasters } from "../../hooks/useMasters";
import { WorkoutSession, WorkoutSessionApiFactory } from "../../openapi";
import { api } from "../../utils/apis";
import { RequiredAuth } from "../../utils/requiredAuth";
import { NoSession } from "./NoSession";
import { Session } from "./Session";

const Workout = () => {
  const [activeSession, setActiveSession] = useState<WorkoutSession>();
  const { masterData } = useMasters();
  const [loading, setLoading] = useState(false);

  const initialize = useRef(false);

  const updateWorkoutSession = useCallback(async () => {
    setLoading(true);
    const res = await api(
      WorkoutSessionApiFactory
    ).v1WorkoutSessionActiveRetrieve();
    setLoading(false);
    if (res.status === 200) {
      setActiveSession(res.data);
    } else {
      setActiveSession(undefined);
    }
  }, []);

  useEffect(() => {
    /** 画面表示時 */
    if (initialize.current) return;
    initialize.current = true;

    updateWorkoutSession();
  }, [updateWorkoutSession]);

  return (
    <Box>
      {loading || !masterData ? (
        <Box>...loading</Box>
      ) : (
        <Box>
          {activeSession ? (
            // セッションあり
            <Session
              endSessionCallback={updateWorkoutSession}
              masterData={masterData}
              activeSession={activeSession}
            />
          ) : (
            // セッションなし
            <NoSession
              startSessionCallback={updateWorkoutSession}
              conditions={masterData.conditions}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default RequiredAuth(Workout);
