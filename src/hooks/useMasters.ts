import { useEffect, useRef, useState } from "react";
import {
  Condition,
  MasterApiFactory,
  TrainingArea,
  WorkoutFeeling,
} from "../openapi";
import { api } from "../utils/apis";

export interface MasterData {
  conditions: Condition[];
  trainingAreas: TrainingArea[];
  workoutFeelings: WorkoutFeeling[];
}

export interface MasterReturns {
  masterData?: MasterData;
}

export const useMasters = (): MasterReturns => {
  const [masterData, setMasterData] = useState<MasterData>();
  const initialize = useRef(false);

  useEffect(() => {
    if (initialize.current) return;
    initialize.current = true;
    (async () => {
      // マスタデータ系取得
      const mFactory = api(MasterApiFactory);
      const cond = (await mFactory.v1ConditionList()).data;
      const area = (await mFactory.v1TrainingAreaList()).data;
      const feel = (await mFactory.v1WorkoutFeelingList()).data;
      setMasterData({
        conditions: cond,
        trainingAreas: area,
        workoutFeelings: feel,
      });
    })();
  }, []);

  return { masterData };
};

type MasterDataList = Condition | TrainingArea | WorkoutFeeling;

export const getMaster = <T extends MasterDataList>(
  id: string,
  master: T[]
): T | undefined => {
  return master.find((m) => m.id === id);
};
