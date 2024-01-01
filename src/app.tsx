import * as React from "react";
import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Workout from "./pages/workout";
import History from "./pages/history";
import { Box } from "@mui/material";
import SessionDetail from "./pages/sessionDetail";

export const App = () => {
  return (
    <Box>
      <Link to="/">トップページヘ</Link>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/history" element={<History />} />
        <Route path="/history/:sessionId" element={<SessionDetail />} />
      </Routes>
    </Box>
  );
};
