import React from 'react';
import MedicamentoCard from './MedicamentoCard';

const MedicamentoList = ({ medicamentos, onDelete, onEdit }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicamentos.map((medicamento) => (
                <MedicamentoCard
                    key={medicamento.id}
                    medicamento={medicamento}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
};

export default MedicamentoList;
