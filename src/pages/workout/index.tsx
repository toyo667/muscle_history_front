import { useCallback, useEffect, useRef, useState } from "react";
import { RequiredAuth } from "../../utils/requiredAuth";
import { api } from "../../utils/apis";
import { WorkoutSession, WorkoutSessionApiFactory } from "../../openapi";
import { useMasters } from "../../hooks/useMasters";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const Workout = () => {
  const [activeSession, setActiveSession] = useState<WorkoutSession>();
  const { masterData } = useMasters();
  const [loading, setLoading] = useState(false);
  const [condition, setCondition] = useState("");

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

  /** view */
  useEffect(() => {
    // 既存のワークアウトセッションを確認する。
    if (initialize.current) return;
    initialize.current = true;
    updateWorkoutSession();
  }, [updateWorkoutSession]);

  const startSession = useCallback(async () => {
    if (!condition) return;
    await api(WorkoutSessionApiFactory).v1WorkoutSessionCreate({
      condition: condition,
    } as any);
    updateWorkoutSession();
  }, [condition, updateWorkoutSession]);

  const endSession = useCallback(async () => {
    const id = activeSession?.id;
    if (!id) return;
    await api(WorkoutSessionApiFactory).v1WorkoutSessionPartialUpdate(id, {
      finished_at: new Date().toISOString(),
    });
    updateWorkoutSession();
  }, [activeSession?.id, updateWorkoutSession]);

  return (
    <div>
      {loading ? (
        <div>...loading</div>
      ) : (
        <div>
          {activeSession ? (
            // セッションあり
            <div>
              <h2>session: {activeSession.id} is currentry actived.</h2>
              <div>
                <Button onClick={endSession}>endsession</Button>
              </div>
            </div>
          ) : (
            // セッションなし
            <div>
              <h2>no active session</h2>
              <div>
                <h3>startSession</h3>
                <Box sx={{ minWidth: 120 }}>
                  <FormControl fullWidth>
                    <InputLabel id="cond-select">Condition</InputLabel>
                    <Select
                      labelId="cond-select"
                      value={condition}
                      onChange={(e) => {
                        setCondition(e.target.value);
                      }}
                    >
                      {masterData?.conditions.map((c) => (
                        <MenuItem value={c.id} key={c.id}>
                          {c.feel}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Button onClick={startSession}>start</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RequiredAuth(Workout);
