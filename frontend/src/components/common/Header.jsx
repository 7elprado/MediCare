import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-white shadow-md">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-purple-600">
                        MediCare
                    </Link>
                    <div className="space-x-4">
                        <Link to="/" className="text-gray-700 hover:text-purple-600">Dashboard</Link>
                        <Link to="/medicamentos" className="text-gray-700 hover:text-purple-600">Medicamentos</Link>
                        <Link to="/historico" className="text-gray-700 hover:text-purple-600">Histórico</Link>
                        <Link to="/relatorios" className="text-gray-700 hover:text-purple-600">Relatórios</Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
