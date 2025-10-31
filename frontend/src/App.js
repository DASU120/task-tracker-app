import React, { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import InsightsPanel from './components/InsightsPanel';
import './App.css';

function App() {
  const [trigger, setTrigger] = useState(0);

  const forceRefetch = () => {
    setTrigger(prev => prev + 1);
  };

  return (
    <div className="App">
      <header>
        <h1>Task Tracker</h1>
      </header>
      <main>
        <InsightsPanel />
        <TaskForm onTaskCreated={forceRefetch} />
        <TaskList key={trigger} /> 
      </main>
    </div>
  );
}

export default App;