# 🏥 MediCare - Sistema de Controle de Medicamentos

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/7elprado/MediCare)
[![Docker](https://img.shields.io/badge/docker-compose-blue.svg)](https://www.docker.com)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org)

## 📋 Sobre o Projeto

O **MediCare** é uma aplicação web para auxiliar pacientes no controle e monitoramento da adesão ao tratamento medicamentoso.

**Desenvolvido para disciplina de DevOps** - Demonstra conceitos de containerização, orquestração, CI/CD e qualidade de software.

## 🎯 Objetivo

Ajudar usuários a não esquecerem seus medicamentos, promovendo maior adesão ao tratamento.

## ✨ Funcionalidades

| Funcionalidade | Status | Descrição |
|----------------|--------|-----------|
| CRUD de Medicamentos | ✅ Concluído | Cadastro, edição, listagem e exclusão |
| Definição de Horários | 🚧 Em desenvolvimento | Configuração de horários por medicamento |
| Registro de Tomadas | 🚧 Em desenvolvimento | Marcar quando tomou o medicamento |
| Histórico | 🚧 Em desenvolvimento | Visualização diária/semanal |
| Relatórios | 🚧 Em desenvolvimento | Estatísticas de adesão |

## 🛠️ Tecnologias

### Frontend
- React.js 18.2.0
- React Router DOM
- Axios
- CSS3

### Backend
- Node.js 18.x
- Express.js 4.18.2
- PostgreSQL 15
- JWT e Bcryptjs

### DevOps
- Docker 24.x
- Docker Compose 2.x
- Jenkins 2.x
- SonarQube 9.x
- Git/GitHub
- GitFlow

## 🏗️ Arquitetura

┌─────────────────────────────────────────────────────────┐
│ DOCKER COMPOSE │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ Frontend │◄──►│ Backend │◄──►│ DB │ │
│ │ Port 80 │ │ Port 3000│ │ Port 5432│ │
│ └──────────┘ └──────────┘ └──────────┘ │
│ ▲ ▲ ▲ │
│ └───────────────┼───────────────┘ │
│ medicare_network │
└─────────────────────────────────────────────────────────┘
## 📁 Estrutura do Projeto
MediCare/
│
├── frontend/ # Aplicação React
│ ├── public/
│ │ ├── index.html
│ │ └── manifest.json
│ ├── src/
│ │ ├── components/
│ │ │ ├── common/
│ │ │ ├── medicamentos/
│ │ │ ├── registros/
│ │ │ └── relatorios/
│ │ ├── pages/
│ │ │ ├── Dashboard.jsx
│ │ │ ├── MedicamentosPage.jsx
│ │ │ ├── HistoricoPage.jsx
│ │ │ └── RelatoriosPage.jsx
│ │ ├── services/
│ │ ├── styles/
│ │ └── App.jsx
│ ├── Dockerfile
│ ├── nginx.conf
│ └── package.json
│
├── backend/ # API Node.js
│ ├── src/
│ │ ├── controllers/
│ │ │ └── medicamentoController.js
│ │ ├── models/
│ │ ├── routes/
│ │ │ └── medicamentoRoutes.js
│ │ ├── middleware/
│ │ ├── config/
│ │ │ └── database.js
│ │ └── app.js
│ ├── tests/
│ ├── Dockerfile
│ └── package.json
│
├── database/ # Scripts do Banco
│ ├── migrations/
│ │ ├── 001_create_usuarios.sql
│ │ ├── 002_create_medicamentos.sql
│ │ ├── 003_create_horarios.sql
│ │ └── 004_create_registros.sql
│ ├── seeds/
│ └── init.sql
│
├── docker/ # Configurações Docker
│ ├── docker-compose.yml
│ ├── docker-compose.dev.yml
│ └── docker-compose.prod.yml
│
├── jenkins/ # Pipeline CI/CD
│ └── Jenkinsfile
│
├── scripts/ # Scripts auxiliares
│ ├── build.sh
│ ├── deploy.sh
│ └── test.sh
│
├── .gitignore
├── .env.example
├── sonar-project.properties
├── README.md
└── LICENSE


## 📋 Pré-requisitos

| Ferramenta | Versão | Comando |
|------------|--------|---------|
| Docker | 20.10+ | `docker --version` |
| Docker Compose | 2.x+ | `docker-compose --version` |
| Git | 2.x+ | `git --version` |
| Node.js | 18.x+ | `node --version` |

## 🚀 Como Executar

### 1. Clone o repositório
```bash
git clone https://github.com/7elprado/MediCare.git
cd MediCare

2. Execute com Docker Compose
cd docker
docker-compose up -d

3. Acesse a aplicação

    Frontend: http://localhost

    Backend API: http://localhost:3000/api/health

    Health Check: http://localhost:3000/api/health

🔌 API Endpoints
Método	Endpoint	Descrição
GET	/api/medicamentos	Lista todos medicamentos
GET	/api/medicamentos/:id	Busca por ID
POST	/api/medicamentos	Cria novo medicamento
PUT	/api/medicamentos/:id	Atualiza medicamento
DELETE	/api/medicamentos/:id	Remove medicamento

Exemplos de uso
bash

# Health check
curl http://localhost:3000/api/health

# Listar medicamentos
curl http://localhost:3000/api/medicamentos

# Criar medicamento
curl -X POST http://localhost:3000/api/medicamentos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Paracetamol","descricao":"Febre e dor","dosagem":"500mg"}'

# Atualizar medicamento
curl -X PUT http://localhost:3000/api/medicamentos/1 \
  -H "Content-Type: application/json" \
  -d '{"nome":"Paracetamol 750mg"}'

# Deletar medicamento
curl -X DELETE http://localhost:3000/api/medicamentos/1

🔄 CI/CD Pipeline
Jenkins Pipeline Stages
groovy

├── Checkout           # Clona o código
├── SonarQube Analysis # Análise de qualidade
├── Build             # Build das imagens Docker
├── Test              # Execução de testes
├── Deploy            # Deploy em produção
└── Notify            # Notificação do resultado

Iniciar Jenkins
bash

cd docker
docker-compose up -d jenkins
# Acesse: http://localhost:8080

Executar análise local
bash

docker-compose up -d sonarqube
sonar-scanner

Padrões de Commit

    feat: Nova funcionalidade

    fix: Correção de bug

    docs: Documentação

    style: Formatação

    refactor: Refatoração

    test: Testes

    chore: Manutenção
# MediCare
