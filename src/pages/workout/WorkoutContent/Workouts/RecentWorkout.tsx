import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { MasterData, getMaster } from "../../../../hooks/useMasters";
import { Workout } from "../../../../openapi";
import React from "react";
import { OmitWorkout } from "./AddWorkout";

interface Props {
  recentWorkouts: Workout[];
  setWorkout: (v: OmitWorkout) => void;
  masterData: MasterData;
  workout: OmitWorkout;
}

export const RecentWorkout: React.FC<Props> = ({
  recentWorkouts,
  setWorkout,
  masterData,
  workout,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>重さ(kg)</TableCell>
            <TableCell>レップ数</TableCell>
            <TableCell>セット数</TableCell>
            <TableCell>感想</TableCell>
            <TableCell>トレーニング日時</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recentWorkouts.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Button
                  onClick={() =>
                    setWorkout({
                      ...workout,
                      rep_count: row.rep_count,
                      set_count: row.set_count,
                      weight_kg: row.weight_kg,
                    })
                  }
                >
                  使う
                </Button>
              </TableCell>
              <TableCell>{row.weight_kg}</TableCell>
              <TableCell>{row.rep_count}</TableCell>
              <TableCell>{row.set_count}</TableCell>
              <TableCell>
                {getMaster(row.feeling, masterData.workoutFeelings)?.feel}
              </TableCell>
              <TableCell>{new Date(row.trained_at).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
