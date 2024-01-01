import { Box } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { MasterData } from "../../../hooks/useMasters";
import { AddWorkoutItem } from "./AddWorkoutItem";
import { WorkoutItem, WorkoutItemApiFactory } from "../../../openapi";
import { api } from "../../../utils/apis";
import { AddWorkout } from "./AddWorkout";

interface Props {
  masterData: MasterData;
}

export const WorkoutContent: React.FC<Props> = ({ masterData }) => {
  const initialize = useRef(false);
  const [workoutItems, setWorkoutItems] = useState<WorkoutItem[]>();

  const refreshWorkoutItemList = useCallback(async () => {
    const res = await api(WorkoutItemApiFactory).v1WorkoutItemList({});
    setWorkoutItems(res.data);
  }, []);

  useEffect(() => {
    /** 画面表示時 */
    if (initialize.current) return;
    initialize.current = true;

    refreshWorkoutItemList();
  }, [refreshWorkoutItemList]);

  return (
    <Box>
      {workoutItems?.map((item) => {
        return <div key={item.id}>{item.training_name}</div>;
      })}
      <AddWorkoutItem
        masterData={masterData}
        successCallback={refreshWorkoutItemList}
      />
      <AddWorkout masterData={masterData} />
    </Box>
  );
};
