import React from 'react';

const MedicamentoCard = ({ medicamento, onDelete, onEdit }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{medicamento.nome}</h3>
            {medicamento.dosagem && (
                <p className="text-gray-600 mb-2">Dosagem: {medicamento.dosagem}</p>
            )}
            {medicamento.descricao && (
                <p className="text-gray-500 text-sm mb-4">{medicamento.descricao}</p>
            )}
            <div className="flex justify-end space-x-2">
                <button
                    onClick={() => onEdit(medicamento)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                    Editar
                </button>
                <button
                    onClick={() => onDelete(medicamento.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                    Excluir
                </button>
            </div>
        </div>
    );
};

export default MedicamentoCard;
