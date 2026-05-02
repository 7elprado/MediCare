import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MedicamentosPage from './pages/MedicamentosPage';
import HistoricoPage from './pages/HistoricoPage';
import RelatoriosPage from './pages/RelatoriosPage';
import Header from './components/common/Header';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/medicamentos" element={<MedicamentosPage />} />
                        <Route path="/historico" element={<HistoricoPage />} />
                        <Route path="/relatorios" element={<RelatoriosPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
