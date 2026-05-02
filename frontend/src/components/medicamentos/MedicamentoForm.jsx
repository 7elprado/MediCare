import React, { useState } from 'react';

const MedicamentoForm = ({ onSubmit, initialData = {} }) => {
    const [formData, setFormData] = useState({
        nome: initialData.nome || '',
        descricao: initialData.descricao || '',
        dosagem: initialData.dosagem || '',
        horarios: initialData.horarios || []
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nome do Medicamento
                </label>
                <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Descrição
                </label>
                <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                    rows="3"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Dosagem
                </label>
                <input
                    type="text"
                    name="dosagem"
                    value={formData.dosagem}
                    onChange={handleChange}
                    placeholder="Ex: 500mg"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                />
            </div>
            <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
                Salvar Medicamento
            </button>
        </form>
    );
};

export default MedicamentoForm;
