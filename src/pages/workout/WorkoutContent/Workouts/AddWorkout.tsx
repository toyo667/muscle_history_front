import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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
import { WorkoutTable } from "./WorkoutTable";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
interface Props {
  masterData: MasterData;
  workoutItems: WorkoutItem[];
  sessionId: string;
  successCallback: () => void;
}

export type OmitWorkout = Omit<WorkoutFmt, "id" | "session" | "trained_at">;

const INIT_WORKOUT: OmitWorkout = {
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
  const initWorkout: OmitWorkout = useMemo(() => {
    return {
      ...INIT_WORKOUT,
      feeling:
        masterData.workoutFeelings.find((e) => e.feel === "normal")?.id || "",
    };
  }, [masterData.workoutFeelings]);
  const [workout, setWorkout] = useState<OmitWorkout>(initWorkout);
  const [selectArea, setSelectAres] = useState("");
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutFmt[]>();
  const [bestWorkout, setBestWorkout] = useState<WorkoutFmt[]>();

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
    /** トレーニング種目が変わったときにトリガー 直近とベストのワークアウトを取得する */
    if (!workout.training_item) {
      setRecentWorkouts(undefined);
      setBestWorkout(undefined);
      return;
    }

    (async () => {
      const factory = api(WorkoutApiFactory);
      const res = await factory.v1WorkoutRecentWorkoutList(
        workout.training_item,
        sessionId
      );
      if (res.status === 200) {
        setRecentWorkouts(res.data);
      } else {
        setRecentWorkouts(undefined);
      }

      const resBest = await factory.v1WorkoutBestWorkoutList(
        workout.training_item
      );
      if (resBest.status === 200) {
        setBestWorkout(resBest.data);
      } else {
        setBestWorkout(undefined);
      }
    })();
  }, [workout.training_item, sessionId]);

  return (
    <Box>
      {/* Workout追加 */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
        >
          <h2>ワークアウトを追加</h2>
        </AccordionSummary>
        <AccordionDetails>
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

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
            >
              <h3>直近のワークアウトを参照</h3>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                {recentWorkouts && (
                  <WorkoutTable
                    tableWorkout={recentWorkouts}
                    setWorkout={setWorkout}
                    masterData={masterData}
                    workout={workout}
                  />
                )}
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
            >
              <h3>過去ベストのワークアウトを参照</h3>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                {bestWorkout && (
                  <WorkoutTable
                    tableWorkout={bestWorkout}
                    setWorkout={setWorkout}
                    masterData={masterData}
                    workout={workout}
                  />
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
