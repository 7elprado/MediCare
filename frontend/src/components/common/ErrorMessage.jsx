import React from 'react';

const ErrorMessage = ({ message }) => {
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Erro: </strong>
            <span className="block sm:inline">{message}</span>
        </div>
    );
};

export default ErrorMessage;
