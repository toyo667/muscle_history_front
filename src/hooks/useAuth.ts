import { useEffect, useState } from "react";
import { api } from "../utils/apis";
import { User } from "../openapi";

interface Returns {
  user?: User;
  loading: boolean;
}

export const useAuth = (): Returns => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await api().v1UserGetInfoRetrieve();
      setLoading(false);
      if (res.data.id) {
        setUser(res.data);
      } else {
        setUser(undefined);
      }
    })();
  }, []);

  return { user, loading };
};
