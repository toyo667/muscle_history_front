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
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>トレーニング種目</TableCell>
                <TableCell>重量</TableCell>
                <TableCell>レップ数</TableCell>
                <TableCell>セット数</TableCell>
                <TableCell>感想</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workouts?.map((wk) => (
                <TableRow key={wk.id}>
                  <TableCell>
                    {workoutItems.find((wi) => wi.id === wk.training_item)
                      ?.training_name || "undefined"}
                  </TableCell>
                  <TableCell>{wk.weight_kg}</TableCell>
                  <TableCell>{wk.rep_count}</TableCell>
                  <TableCell>{wk.set_count}</TableCell>
                  <TableCell>
                    {getMaster(wk.feeling, masterData.workoutFeelings)?.feel ||
                      ""}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
