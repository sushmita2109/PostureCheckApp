import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import CheckPosture from "./CheckPosture";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/posture" element={<CheckPosture />} />
      </Routes>
    </>
  );
}

export default App;
