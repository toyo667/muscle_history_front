import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/home";
import Workout from "./pages/workout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/workout",
    element: <Workout />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
