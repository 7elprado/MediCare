import React from 'react';

const Dashboard = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800">Medicamentos</h3>
                    <p className="text-3xl font-bold text-purple-600">0</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800">Tomadas Hoje</h3>
                    <p className="text-3xl font-bold text-green-600">0</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800">Adesão</h3>
                    <p className="text-3xl font-bold text-blue-600">0%</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
