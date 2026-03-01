import { useState } from "react";
import LadderForm from "./components/LadderForm";
import Settings from "./components/Settings";
import { loadSampleData } from "./components/LadderForm";
import "./css/index.css";

function App() {
  const [showSettings, setShowSettings] = useState(false);

  const handleReset = () => {
    const samplePlayers = loadSampleData();
    // Trigger a re-render by calling loadSampleData from localStorage
    localStorage.setItem("ladder_players", JSON.stringify(samplePlayers));
    window.location.reload();
  };

  return (
    <>
      <LadderForm setShowSettings={setShowSettings} />
      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
          onReset={handleReset}
        />
      )}
    </>
  );
}

export default App;
