CREATE TABLE IF NOT EXISTS registros (
    id SERIAL PRIMARY KEY,
    medicamento_id INTEGER REFERENCES medicamentos(id) ON DELETE CASCADE,
    horario_id INTEGER REFERENCES horarios(id),
    data_hora_tomada TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'tomado',
    observacao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_registros_medicamento ON registros(medicamento_id);
CREATE INDEX idx_registros_data ON registros(data_hora_tomada);
