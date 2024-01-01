import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { MasterData } from "../../../../hooks/useMasters";
import {
  WorkoutApiFactory,
  Workout as WorkoutFmt,
  WorkoutItem,
} from "../../../../openapi";
import { api } from "../../../../utils/apis";

interface Props {
  masterData: MasterData;
  workoutItems: WorkoutItem[];
  sessionId: string;
  successCallback: () => void;
}

type Workout = Omit<WorkoutFmt, "id" | "session" | "trained_at">;

const INIT_WORKOUT: Workout = {
  rep_count: 10,
  set_count: 3,
  weight_kg: 50,
  training_item: "",
  feeling: "",
};

export const AddWorkout: React.FC<Props> = ({
  masterData,
  workoutItems,
  sessionId,
  successCallback,
}) => {
  const [workout, setWorkout] = useState<Workout>({
    ...INIT_WORKOUT,
    feeling:
      masterData.workoutFeelings.find((e) => e.feel === "normal")?.id || "",
  });
  const [selectArea, setSelectAres] = useState("");

  const addWorkout = useCallback(() => {
    // TODO: バリデーションはもうちょっと真面目にやる。。
    let isEmptyField = false;
    for (const v of Object.values(workout)) {
      if (!v) {
        isEmptyField = true;
        break;
      }
    }
    if (isEmptyField) return;

    (async () => {
      await api(WorkoutApiFactory).v1WorkoutCreate({
        ...workout,
        session: sessionId,
      } as any);
      successCallback();
    })();
  }, [workout, sessionId, successCallback]);

  const filteredWorkoutItems = useMemo(() => {
    if (selectArea) {
      return workoutItems.filter((item) => item.category.includes(selectArea));
    } else {
      return workoutItems;
    }
  }, [selectArea, workoutItems]);

  return (
    <Box>
      <h2>Workoutを追加</h2>
      <FormControl sx={{ minWidth: 140 }}>
        <InputLabel shrink htmlFor="select-area">
          トレーニング部位
        </InputLabel>
        <Select
          value={selectArea}
          onChange={(e) => setSelectAres(e.target.value)}
          label="Training Area"
          inputProps={{
            id: "select-area",
          }}
        >
          <MenuItem key={"empty"} value={""}></MenuItem>
          {masterData.trainingAreas.map((area) => (
            <MenuItem key={area.id} value={area.id}>
              {area.training_area}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 140 }}>
        <InputLabel shrink htmlFor="select-items">
          トレーニング種目
        </InputLabel>
        <Select
          value={workout.training_item}
          onChange={(e) =>
            setWorkout({ ...workout, training_item: e.target.value })
          }
          label="Training Item"
          inputProps={{
            id: "select-items",
          }}
        >
          {filteredWorkoutItems.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.training_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Rep"
        type="number"
        value={workout.rep_count}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(e) => {
          const v = parseInt(e.target.value);
          return setWorkout({
            ...workout,
            rep_count: v < 0 ? 0 : v,
          });
        }}
      />
      <TextField
        label="Set"
        type="number"
        value={workout.set_count}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(e) => {
          const v = parseInt(e.target.value);
          return setWorkout({
            ...workout,
            set_count: v < 0 ? 0 : v,
          });
        }}
      />
      <TextField
        label="Weight(kg)"
        type="number"
        value={workout.weight_kg}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(e) => {
          const v = parseInt(e.target.value);
          return setWorkout({ ...workout, weight_kg: v < 0 ? 0 : v });
        }}
      />
      <FormControl sx={{ minWidth: 140 }}>
        <InputLabel shrink htmlFor="select-feel">
          感想
        </InputLabel>
        <Select
          value={workout.feeling}
          onChange={(e) => setWorkout({ ...workout, feeling: e.target.value })}
          label="Feeling"
          inputProps={{
            id: "select-feel",
          }}
        >
          {masterData.workoutFeelings.map((feel) => (
            <MenuItem key={feel.id} value={feel.id}>
              {feel.feel}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button onClick={addWorkout}>ワークアウトを追加</Button>
    </Box>
  );
};
