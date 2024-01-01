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
import React, { useEffect, useState } from "react";
import { WorkoutSession, WorkoutSessionApiFactory } from "../../../openapi";
import { api } from "../../../utils/apis";
import { MasterData, getMaster } from "../../../hooks/useMasters";
import { Link } from "react-router-dom";

interface Props {
  master: MasterData;
}

export const SessionHistory: React.FC<Props> = ({ master }) => {
  const [sessions, setSessions] = useState<WorkoutSession[]>();

  useEffect(() => {
    (async () => {
      const res = await api(WorkoutSessionApiFactory).v1WorkoutSessionList();
      setSessions(res.data);
    })();
  }, []);

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>感想</TableCell>
              <TableCell>開始日時</TableCell>
              <TableCell>終了日時</TableCell>
              <TableCell>詳細</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions?.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  {getMaster(s.condition, master.conditions)?.feel ||
                    "undefined"}
                </TableCell>
                <TableCell>{new Date(s.started_at).toLocaleString()}</TableCell>
                <TableCell>
                  {s.finished_at
                    ? new Date(s.finished_at).toLocaleString()
                    : "not finished yet"}
                </TableCell>
                <TableCell>
                  <Link to={`/history/${s.id}`}>詳細ページへ</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
