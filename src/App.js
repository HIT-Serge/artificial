import React, { createContext, useContext, useState } from 'react'; // Added imports
import AIFetch from './components/AIFetch';
import AIFetchB from './components/AIFetchB';
import AIFetchC from './components/AIFetchC';
import PromptBar from './components/PromptBar.js';

// Create a context for the state available to all components
export const PromptContext = createContext();
export default function App() {

  const [prompt, setPrompt] = useState(null);

  const contextValue = [prompt, setPrompt]; // Define your context value here

  return (
    <PromptContext.Provider value={contextValue}>
      <div>
        <PromptBar />
        {/* <AIFetch /> */}
        {prompt && <AIFetchB />}
        {/* <AIFetchC /> */}

      </div>
    </PromptContext.Provider>
  );
}

// Optional: Custom hook to use the context
// export const useMyContext = () => useContext(StateContext);

