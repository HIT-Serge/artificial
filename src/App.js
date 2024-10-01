import React, { createContext, useState } from 'react';
import './App.css';
import AIFetch from './components/AIFetch';
import AIFetchB from './components/AIFetchB';
import AIFetchC from './components/AIFetchC';
import AIFetchD from './components/AIFetchD';
import AIFetchE from './components/AIFetchE';
import PromptTemplates from './PromptTemplates';
import PromptBar from './components/PromptBar';

export const PromptContext = createContext();

function App() {
  const [prompt, setPrompt] = useState({ language: 'English', text: '' });

  return (
    <PromptContext.Provider value={[prompt, setPrompt]}>
      <div className="App">
        {/* <header className="App-header">
          <h1>AI Fetch Examples</h1>
        </header> */}
        <main>
          {/* <PromptBar />
          <AIFetch /> */}
          {/* <AIFetchB />
          <AIFetchC /> */}
          {/* <AIFetchD /> */}
          <AIFetchE />
          {/* <PromptTemplates /> */}
        </main>
      </div>
    </PromptContext.Provider>
  );
}

export default App;

