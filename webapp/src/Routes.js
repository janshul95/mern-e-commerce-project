import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import App from "./App";
import Home from "./core/Home";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
