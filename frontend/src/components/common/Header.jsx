import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          🏥 MediCare
        </Link>
        <nav className="nav-menu">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Dashboard
          </Link>
          <Link to="/medicamentos" className={location.pathname === '/medicamentos' ? 'active' : ''}>
            Medicamentos
          </Link>
          <Link to="/historico" className={location.pathname === '/historico' ? 'active' : ''}>
            Histórico
          </Link>
          <Link to="/relatorios" className={location.pathname === '/relatorios' ? 'active' : ''}>
            Relatórios
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
