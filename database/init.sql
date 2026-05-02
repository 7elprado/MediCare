-- Criar tabela de medicamentos
CREATE TABLE IF NOT EXISTS medicamentos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    dosagem VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de horários
CREATE TABLE IF NOT EXISTS horarios (
    id SERIAL PRIMARY KEY,
    medicamento_id INTEGER REFERENCES medicamentos(id) ON DELETE CASCADE,
    horario TIME NOT NULL,
    dias_semana INTEGER[] DEFAULT '{0,1,2,3,4,5,6}',
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de registros
CREATE TABLE IF NOT EXISTS registros (
    id SERIAL PRIMARY KEY,
    medicamento_id INTEGER REFERENCES medicamentos(id) ON DELETE CASCADE,
    horario_id INTEGER REFERENCES horarios(id),
    data_hora_tomada TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'tomado',
    observacao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices
CREATE INDEX idx_registros_medicamento ON registros(medicamento_id);
CREATE INDEX idx_registros_data ON registros(data_hora_tomada);
CREATE INDEX idx_horarios_medicamento ON horarios(medicamento_id);

-- Inserir dados de exemplo
INSERT INTO medicamentos (nome, descricao, dosagem) VALUES 
('Paracetamol', 'Analgésico e antitérmico', '500mg'),
('Ibuprofeno', 'Anti-inflamatório', '400mg');

INSERT INTO horarios (medicamento_id, horario, dias_semana) VALUES 
(1, '08:00:00', '{1,2,3,4,5}'),
(1, '20:00:00', '{1,2,3,4,5}'),
(2, '12:00:00', '{0,1,2,3,4,5,6}');
