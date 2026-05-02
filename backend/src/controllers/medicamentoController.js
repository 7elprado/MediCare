class MedicamentoController {
    listar(req, res) {
        res.json({ medicamentos: [], message: 'Lista de medicamentos' });
    }

    criar(req, res) {
        const { nome, descricao, dosagem } = req.body;
        res.status(201).json({ 
            id: Date.now(),
            nome, 
            descricao, 
            dosagem,
            message: 'Medicamento criado com sucesso' 
        });
    }

    atualizar(req, res) {
        const { id } = req.params;
        res.json({ id, ...req.body, message: 'Medicamento atualizado' });
    }

    deletar(req, res) {
        const { id } = req.params;
        res.status(204).send();
    }
}

module.exports = new MedicamentoController();
