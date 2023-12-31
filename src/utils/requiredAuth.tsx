import React from "react";
import { useAuth } from "../hooks/useAuth";

export function RequiredAuth(
  Component: React.ComponentType
): React.FunctionComponent {
  return function Wrapper(): React.ReactElement {
    const user = useAuth();

    return (
      <div>
        {user.loading ? (
          <div>loading...</div>
        ) : (
          <div>
            {user.user ? (
              <div>
                <Component />
              </div>
            ) : (
              <div>
                <div>need to login</div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
}
