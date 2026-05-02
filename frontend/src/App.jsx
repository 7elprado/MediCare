import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MedicamentosPage from './pages/MedicamentosPage';
import Header from './components/common/Header';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/medicamentos" element={<MedicamentosPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
