import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../utils/apis";
import {
  Workout,
  WorkoutApiFactory,
  WorkoutItem,
  WorkoutItemApi,
  WorkoutItemApiFactory,
  WorkoutSessionApiFactory,
} from "../../openapi";
import { WorkoutTable } from "../../components/tables/WorkoutTable";
import { useMasters } from "../../hooks/useMasters";

export const SessionDetail = () => {
  const [workouts, setWorkouts] = useState<Workout[]>();
  const [workoutItems, setWorkoutItems] = useState<WorkoutItem[]>();
  const { sessionId } = useParams();
  const { masterData } = useMasters();

  useEffect(() => {
    (async () => {
      const res = await api(WorkoutApiFactory).v1WorkoutList(sessionId);
      setWorkouts(res.data);
      const resItem = await api(WorkoutItemApiFactory).v1WorkoutItemList();
      setWorkoutItems(resItem.data);
    })();
  }, [sessionId]);

  return (
    <Box>
      {workouts && masterData && workoutItems && (
        <WorkoutTable
          workouts={workouts}
          masterData={masterData}
          workoutItems={workoutItems}
        />
      )}
    </Box>
  );
};
