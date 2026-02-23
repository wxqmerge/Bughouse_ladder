import { useState } from 'react';
import LadderForm from './components/LadderForm';
import Settings from './components/Settings';
import './css/index.css';

function App() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <LadderForm />
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </>
  );
}

export default App;