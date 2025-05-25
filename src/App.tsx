import React from 'react';
import MainLayout from './components/layout/MainLayout';
import { DiagramProvider } from './store/DiagramContext';

function App() {
  return (
    <DiagramProvider>
      <MainLayout />
    </DiagramProvider>
  );
}

export default App;