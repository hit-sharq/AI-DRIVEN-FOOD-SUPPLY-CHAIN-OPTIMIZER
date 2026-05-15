import React from 'react';
import ShelfLifePredictor from './components/ShelfLifePredictor';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AI-Driven Food Supply Chain Optimizer</h1>
        <p>Reducing waste, increasing profits</p>
      </header>
      <main>
        <ShelfLifePredictor />
      </main>
    </div>
  );
}

export default App;
