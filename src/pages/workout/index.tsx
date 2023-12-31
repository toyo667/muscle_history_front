import { useCallback, useEffect, useRef, useState } from "react";
import { RequiredAuth } from "../../utils/requiredAuth";
import { api } from "../../utils/apis";
import { WorkoutSession, WorkoutSessionApiFactory } from "../../openapi";
import { useMasters } from "../../hooks/useMasters";

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

  /** view */
  useEffect(() => {
    // 既存のワークアウトセッションを確認する。
    if (initialize.current) return;
    initialize.current = true;
    updateWorkoutSession();
  }, [updateWorkoutSession]);

  const startSession = useCallback(async () => {
    await api(WorkoutSessionApiFactory).v1WorkoutSessionCreate({
      condition: masterData?.conditions[0].id,
    } as any);
    updateWorkoutSession();
  }, [masterData?.conditions, updateWorkoutSession]);

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
            <div>
              <h2>session: {activeSession.id} is currentry actived.</h2>
              <div>
                <button onClick={endSession}>endsession</button>
              </div>
            </div>
          ) : (
            <div>
              <h2>no active session</h2>
              <div>
                <h3>startSession</h3>
                <button onClick={startSession}>start</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RequiredAuth(Workout);
