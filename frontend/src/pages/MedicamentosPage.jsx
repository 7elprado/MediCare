import React, { useState } from 'react';
import MedicamentoForm from '../components/medicamentos/MedicamentoForm';
import MedicamentoList from '../components/medicamentos/MedicamentoList';

const MedicamentosPage = () => {
    const [medicamentos, setMedicamentos] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const handleAddMedicamento = (medicamento) => {
        const newMedicamento = { ...medicamento, id: Date.now() };
        setMedicamentos([...medicamentos, newMedicamento]);
        setShowForm(false);
    };

    const handleDelete = (id) => {
        setMedicamentos(medicamentos.filter(m => m.id !== id));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Medicamentos</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                    {showForm ? 'Cancelar' : '+ Novo Medicamento'}
                </button>
            </div>
            
            {showForm && (
                <div className="mb-8">
                    <MedicamentoForm onSubmit={handleAddMedicamento} />
                </div>
            )}
            
            <MedicamentoList 
                medicamentos={medicamentos}
                onDelete={handleDelete}
                onEdit={() => {}}
            />
        </div>
    );
};

export default MedicamentosPage;
