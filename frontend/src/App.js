import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import AssistantPage from "./pages/assistant";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/assistant" element={<AssistantPage />} />
      </Routes>
    </Router>
  );
}

export default App;
