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
import { MasterData, getMaster } from "../../hooks/useMasters";
import { Workout, WorkoutItem } from "../../openapi";
import React from "react";

interface Props {
  masterData: MasterData;
  workouts: Workout[];
  workoutItems: WorkoutItem[];
}
export const WorkoutTable: React.FC<Props> = ({
  workouts,
  workoutItems,
  masterData,
}) => {
  return (
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
                {getMaster(wk.feeling, masterData.workoutFeelings)?.feel || ""}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
