import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  weight_kg: 0,
  training_item: "",
  feeling: "",
};

export const AddWorkout: React.FC<Props> = ({
  masterData,
  workoutItems,
  sessionId,
  successCallback,
}) => {
  const initWorkout: Workout = useMemo(() => {
    return {
      ...INIT_WORKOUT,
      feeling:
        masterData.workoutFeelings.find((e) => e.feel === "normal")?.id || "",
    };
  }, [masterData.workoutFeelings]);
  const [workout, setWorkout] = useState<Workout>(initWorkout);
  const [selectArea, setSelectAres] = useState("");
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutFmt[]>();

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
      setWorkout({ ...initWorkout, training_item: workout.training_item });
    })();
  }, [workout, sessionId, successCallback, initWorkout]);

  const filteredWorkoutItems = useMemo(() => {
    if (selectArea) {
      return workoutItems.filter((item) => item.category.includes(selectArea));
    } else {
      return workoutItems;
    }
  }, [selectArea, workoutItems]);

  useEffect(() => {
    /** トレーニング種目が変わったときにトリガー 直近のワークアウトを取得する */
    if (!workout.training_item) {
      setRecentWorkouts(undefined);
      return;
    }
    (async () => {
      const res = await api(WorkoutApiFactory).v1WorkoutRecentWorkoutList(
        workout.training_item,
        sessionId
      );
      if (res.status === 200) {
        setRecentWorkouts(res.data);
      } else {
        setRecentWorkouts(undefined);
      }
    })();
  }, [workout.training_item, sessionId]);

  return (
    <Box>
      <Box>
        <h2>Workoutを追加</h2>
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel shrink htmlFor="select-area">
            トレーニング部位
          </InputLabel>
          <Select
            value={selectArea}
            onChange={(e) => {
              setSelectAres(e.target.value);
              setWorkout({ ...workout, training_item: "" });
            }}
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
            onChange={(e) => {
              setWorkout({ ...workout, training_item: e.target.value });
            }}
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
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel shrink htmlFor="select-feel">
            感想
          </InputLabel>
          <Select
            value={workout.feeling}
            onChange={(e) =>
              setWorkout({ ...workout, feeling: e.target.value })
            }
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
      <Box>
        <h3>直近のワークアウトを参照</h3>
        {recentWorkouts && (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>重さ(kg)</TableCell>
                  <TableCell>レップ数</TableCell>
                  <TableCell>セット数</TableCell>
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
                      {new Date(row.trained_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};
