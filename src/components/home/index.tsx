import React, { useEffect, useRef, useState } from "react";
import { WorkoutItem } from "../../openapi/api";
import { api } from "../../utils/apis";

export const Home = () => {
  const [workoutItems, setWorkoutItems] = useState<WorkoutItem[]>();
  const trainingName = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const res = await api().v1WorkoutItemList();
      setWorkoutItems(res.data);
    })();
  }, []);

  const clickHandler = React.useCallback(() => {
    (async () => {
      if (!trainingName.current) return;

      const res = await api().v1WorkoutItemCreate({
        training_name: trainingName.current.value,
        category: ["d3c33431-47b1-4c90-b005-f1a0f3e0ac1e"],
      } as any);

      console.log(res);
    })();
  }, []);

  return (
    <div>
      <h1>Sample page</h1>
      <div>
        <h2>get</h2>
        {workoutItems?.map((wk) => {
          return (
            <div key={wk.id}>
              <div>{wk.id}</div>
              <div>{wk.category}</div>
              <div>{wk.training_name}</div>
            </div>
          );
        })}
      </div>
      <div>
        <h2>post</h2>
        <input type="text" ref={trainingName} />
        <button onClick={clickHandler}>post</button>
      </div>
    </div>
  );
};
