import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { MasterData, getMaster } from "../../../../hooks/useMasters";
import { Workout, WorkoutApiFactory, WorkoutItem } from "../../../../openapi";
import { api } from "../../../../utils/apis";
import { AddWorkout } from "./AddWorkout";
import { WorkoutTable } from "../../../../components/tables/WorkoutTable";

interface Props {
  masterData: MasterData;
  workoutItems: WorkoutItem[];
  sessionId: string;
}

export const Workouts: React.FC<Props> = ({
  masterData,
  workoutItems,
  sessionId,
}) => {
  const [workouts, setWorkouts] = useState<Workout[]>();

  const updateSessionWorkoutList = useCallback(async () => {
    const res = await api(WorkoutApiFactory).v1WorkoutList(sessionId);
    setWorkouts(res.data);
  }, [sessionId]);

  useEffect(() => {
    updateSessionWorkoutList();
  }, [updateSessionWorkoutList]);

  return (
    <Box>
      <AddWorkout
        masterData={masterData}
        workoutItems={workoutItems}
        sessionId={sessionId}
        successCallback={updateSessionWorkoutList}
      />
      <Box>
        <h2>今日のワークアウト一覧</h2>
        {workouts && (
          <WorkoutTable
            masterData={masterData}
            workoutItems={workoutItems}
            workouts={workouts}
          />
        )}
      </Box>
    </Box>
  );
};
