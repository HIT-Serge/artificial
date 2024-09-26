import React, { createContext, useState } from 'react';
import './App.css';
import AIFetchB from './components/AIFetchB';
import AIFetchC from './components/AIFetchC';
import PromptTemplates from './PromptTemplates';

export const PromptContext = createContext();

function App() {
  const [prompt, setPrompt] = useState({ language: 'English', text: '' });

  return (
    <PromptContext.Provider value={[prompt, setPrompt]}>
      <div className="App">
        <header className="App-header">
          <h1>AI Fetch Examples</h1>
        </header>
        <main>
          <AIFetchB />
          <AIFetchC />
          <PromptTemplates />
        </main>
      </div>
    </PromptContext.Provider>
  );
}

export default App;

