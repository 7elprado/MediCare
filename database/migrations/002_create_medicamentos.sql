CREATE TABLE IF NOT EXISTS medicamentos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    dosagem VARCHAR(50),
    quantidade_total INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS horarios (
    id SERIAL PRIMARY KEY,
    medicamento_id INTEGER REFERENCES medicamentos(id) ON DELETE CASCADE,
    horario TIME NOT NULL,
    dias_semana INTEGER[],
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
