import React, { useCallback, useState } from "react";
import { MasterData } from "../../../hooks/useMasters";
import { WorkoutItem, WorkoutItemApiFactory } from "../../../openapi";
import { api } from "../../../utils/apis";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from "@mui/material";

interface Props {
  masterData: MasterData;
  successCallback: CallableFunction;
}

type CreateWorkoutItem = Omit<WorkoutItem, "id">;

const INIT_ITEM = {
  training_name: "",
  category: [],
};

export const AddWorkoutItem: React.FC<Props> = ({
  masterData,
  successCallback,
}) => {
  const [wkItem, setWkItem] = useState<CreateWorkoutItem>(INIT_ITEM);

  const addNewWorkoutItem = useCallback(async () => {
    if (!wkItem?.category.length || !wkItem.training_name) return;
    await api(WorkoutItemApiFactory).v1WorkoutItemCreate({
      category: wkItem.category,
      training_name: wkItem.training_name,
    } as any);
    successCallback();
    setWkItem(INIT_ITEM);
  }, [wkItem, successCallback]);

  const handleChangeMultiple = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { options } = event.target;
    const values: string[] = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }
    setWkItem({
      ...wkItem,
      category: values,
    });
  };

  return (
    <Box>
      {/* トレーニング追加 */}
      <h2>Add new Item</h2>
      <Box sx={{ minWidth: 120 }}>
        <FormControl>
          <TextField
            label="Training name"
            variant="outlined"
            value={wkItem.training_name}
            onChange={(e) => {
              setWkItem({
                ...wkItem,
                training_name: e.target.value,
              });
            }}
          />
        </FormControl>
        <FormControl>
          <InputLabel shrink htmlFor="select-categories">
            Native
          </InputLabel>
          <Select
            multiple
            native
            value={wkItem.category}
            // @ts-ignore Typings are not considering `native`
            onChange={handleChangeMultiple}
            label="trainingAreas"
            inputProps={{
              id: "select-categories",
            }}
          >
            {masterData.trainingAreas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.training_area}
              </option>
            ))}
          </Select>
        </FormControl>
        <Button onClick={addNewWorkoutItem}>トレーニング種類を追加</Button>
      </Box>
    </Box>
  );
};
