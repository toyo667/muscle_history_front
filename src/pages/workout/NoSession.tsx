import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { api } from "../../utils/apis";
import { Condition, WorkoutSessionApiFactory } from "../../openapi";

interface Props {
  startSessionCallback: () => void;
  conditions: Condition[];
}

export const NoSession: React.FC<Props> = ({
  startSessionCallback,
  conditions,
}) => {
  const [condition, setCondition] = useState("");

  const startSession = useCallback(async () => {
    if (!condition) return;
    await api(WorkoutSessionApiFactory).v1WorkoutSessionCreate({
      condition: condition,
    } as any);

    startSessionCallback();
  }, [condition, startSessionCallback]);

  return (
    <Box>
      <h2>no active session</h2>
      <Box>
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
              {conditions.map((c) => (
                <MenuItem value={c.id} key={c.id}>
                  {c.feel}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button onClick={startSession}>start</Button>
      </Box>
    </Box>
  );
};
