import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import CheckPosture from "./CheckPosture";
import JumpDetector from "./JumpDetector";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/squat" element={<CheckPosture />} />
        <Route path="/jump" element={<JumpDetector />} />
      </Routes>
    </>
  );
}

export default App;
