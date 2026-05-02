# 🏥 MediCare - Sistema de Controle de Medicamentos

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/7elprado/MediCare)
[![Docker](https://img.shields.io/badge/docker-compose-blue.svg)](https://www.docker.com)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg)](https://www.postgresql.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📋 Sobre o Projeto

O **MediCare** é uma aplicação web completa desenvolvida para auxiliar pacientes no gerenciamento e monitoramento da adesão ao tratamento medicamentoso. O sistema permite que usuários cadastrem seus medicamentos, definam horários personalizados, registrem as tomadas realizadas e acompanhem estatísticas detalhadas de adesão ao tratamento.

**Desenvolvido para disciplina de DevOps** - Demonstra conceitos de containerização, orquestração de serviços, CI/CD e análise de qualidade de software.

## 🎯 Objetivo

Ajudar usuários a não esquecerem seus medicamentos, promovendo maior adesão ao tratamento através de:
- Registro organizado de medicamentos
- Controle de horários personalizados
- Histórico completo de tomadas
- Relatórios de adesão
- Dashboard com métricas

## ✨ Funcionalidades

| Funcionalidade | Status | Descrição |
|----------------|--------|-----------|
| CRUD de Medicamentos | ✅ Concluído | Cadastro, edição, listagem e exclusão |
| Definição de Horários | ✅ Concluído | Configuração de horários por medicamento |
| Registro de Tomadas | ✅ Concluído | Marcar quando tomou o medicamento |
| Dashboard | ✅ Concluído | Visão geral com estatísticas |
| Relatório de Adesão | ✅ Concluído | Percentual de cumprimento do tratamento |
| Histórico | ✅ Concluído | Visualização de tomadas realizadas |

## 🛠️ Tecnologias Utilizadas

### Frontend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| React.js | 18.2.0 | Biblioteca para construção da UI |
| React Router DOM | 6.14.0 | Roteamento da aplicação |
| Axios | 1.4.0 | Cliente HTTP para API |
| CSS3 | - | Estilização e animações |

### Backend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Node.js | 18.x | Runtime JavaScript |
| Express.js | 4.18.2 | Framework web |
| PostgreSQL | 15 | Banco de dados relacional |
| pg | 8.11.0 | Driver PostgreSQL |

### DevOps & Infrastructure
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| Docker | 24.x | Containerização |
| Docker Compose | 2.x | Orquestração de containers |
| Jenkins | 2.x | Pipeline CI/CD |
| SonarQube | 9.x | Análise de qualidade |
| Git | 2.x | Controle de versão |
| GitHub | - | Repositório remoto |
| GitFlow | - | Estratégia de branches |


## 🏗️ Arquitetura do Sistema
+------------------------------------------------------------------+
| CLIENTE |
| (Navegador Web) |
+--------------------------------+---------------------------------+
|
v
+------------------------------------------------------------------+
| DOCKER COMPOSE |
| |
| +--------------+ +--------------+ +--------------+ |
| | FRONTEND | | BACKEND | | POSTGRESQL | |
| | (Nginx) |<-->| (Node.js) |<-->| (DB) | |
| | Port: 3000 | | Port: 3001 | | Port: 5432 | |
| +--------------+ +--------------+ +--------------+ |
| |
| medicare_network |
+------------------------------------------------------------------+



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

│ │ │ │ ├── Header.jsx

│ │ │ │ ├── Footer.jsx

│ │ │ │ └── Loading.jsx

│ │ │ ├── medicamentos/

│ │ │ │ ├── MedicamentoForm.jsx

│ │ │ │ ├── MedicamentoList.jsx

│ │ │ │ ├── MedicamentoCard.jsx

│ │ │ │ └── HorariosForm.jsx

│ │ │ └── registros/

│ │ │ └── RegistroTomada.jsx

│ │ ├── pages/

│ │ │ ├── Dashboard.jsx

│ │ │ ├── MedicamentosPage.jsx

│ │ │ ├── HistoricoPage.jsx

│ │ │ └── RelatoriosPage.jsx

│ │ ├── services/

│ │ │ ├── api.js

│ │ │ ├── horarioService.js

│ │ │ ├── registroService.js

│ │ │ └── relatorioService.js

│ │ ├── styles/

│ │ │ └── global.css

│ │ ├── App.jsx

│ │ └── index.js

│ ├── Dockerfile

│ ├── nginx.conf

│ └── package.json

│

├── backend/ # API Node.js

│ ├── src/

│ │ ├── controllers/

│ │ │ ├── medicamentoController.js

│ │ │ ├── horarioController.js

│ │ │ ├── registroController.js

│ │ │ └── relatorioController.js

│ │ ├── models/

│ │ ├── routes/

│ │ │ ├── medicamentoRoutes.js

│ │ │ ├── horarioRoutes.js

│ │ │ ├── registroRoutes.js

│ │ │ └── relatorioRoutes.js

│ │ ├── config/

│ │ │ └── database.js

│ │ └── app.js

│ ├── Dockerfile

│ └── package.json

│

├── database/ # Scripts do Banco

│ ├── migrations/

│ │ ├── 001_create_usuarios.sql

│ │ ├── 002_create_medicamentos.sql

│ │ ├── 003_create_horarios.sql

│ │ └── 004_create_registros.sql

│ └── init.sql

│

├── docker/ # Configurações Docker

│ ├── docker-compose.yml

│ └── docker-compose.dev.yml

│

├── jenkins/ # Pipeline CI/CD

│ └── Jenkinsfile

│

├── scripts/ # Scripts auxiliares

│ ├── start.sh

│ └── stop.sh

│

├── .gitignore

├── .env.example

├── sonar-project.properties

├── README.md

└── LICENSE



## 📋 Pré-requisitos

| Ferramenta | Versão | Comando para verificar |
|------------|--------|----------------------|
| Docker | 20.10+ | `docker --version` |
| Docker Compose | 2.x+ | `docker-compose --version` |
| Git | 2.x+ | `git --version` |
| Node.js | 18.x+ | `node --version` |

## 🚀 Como Executar

### 1. Clone o repositório

git clone https://github.com/7elprado/MediCare.git
cd MediCare

2. Acesse a tag da etapa 2 (versão final)


git checkout etapa2

3. Execute com Docker Compose


cd docker
docker-compose up -d

4. Acesse a aplicação
Serviço	URL
Frontend	http://localhost:3000
Backend API	http://localhost:3001/api/health
Listar Medicamentos	http://localhost:3001/api/medicamentos
🔌 API Endpoints
Health Check
Método	Endpoint	Descrição
GET	/api/health	Verifica status da API
Medicamentos
Método	Endpoint	Descrição
GET	/api/medicamentos	Lista todos medicamentos
GET	/api/medicamentos/:id	Busca medicamento por ID
POST	/api/medicamentos	Cria novo medicamento
PUT	/api/medicamentos/:id	Atualiza medicamento
DELETE	/api/medicamentos/:id	Remove medicamento
Horários
Método	Endpoint	Descrição
GET	/api/horarios	Lista horários
POST	/api/horarios	Cria horário
PUT	/api/horarios/:id	Atualiza horário
DELETE	/api/horarios/:id	Remove horário
Registros
Método	Endpoint	Descrição
GET	/api/registros	Lista registros
GET	/api/registros/hoje	Registros de hoje
POST	/api/registros	Registra tomada
Relatórios
Método	Endpoint	Descrição
GET	/api/relatorios/adesao	Relatório de adesão
GET	/api/relatorios/horarios-hoje	Horários do dia

🧪 Testando a API com cURL

# Health check
curl http://localhost:3001/api/health

# Listar medicamentos
curl http://localhost:3001/api/medicamentos

# Criar medicamento
curl -X POST http://localhost:3001/api/medicamentos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Paracetamol","descricao":"Dor e febre","dosagem":"500mg"}'

# Atualizar medicamento
curl -X PUT http://localhost:3001/api/medicamentos/1 \
  -H "Content-Type: application/json" \
  -d '{"nome":"Paracetamol 750mg"}'

# Deletar medicamento
curl -X DELETE http://localhost:3001/api/medicamentos/1

# Relatório de adesão
curl http://localhost:3001/api/relatorios/adesao

# Registrar tomada
curl -X POST http://localhost:3001/api/registros \
  -H "Content-Type: application/json" \
  -d '{"medicamento_id":1}'

🔧 Comandos Úteis

# Subir containers
cd docker && docker-compose up -d

# Ver status
docker-compose ps

# Ver logs
docker-compose logs -f

# Ver logs do backend
docker-compose logs -f backend

# Ver logs do frontend
docker-compose logs -f frontend

# Parar containers
docker-compose down

# Reconstruir containers
docker-compose up -d --build

# Acessar banco de dados
docker exec -it medicare_db psql -U medicare_user -d medicare_db

👥 Integrante da Equipe
Nome		                        Função
[samuelprado]		Tech Lead/DevOps - Desenvolvimento FullStack
[samuelprado]		Backend Developer - API e Banco de dados
[samuelprado]		Frontend Developer - UI/UX e Componentes

📊 Status do Projeto
Etapa 1 - Estruturação e Containerização ✅ (100%)

    Repositório GitHub criado

    GitFlow implementado

    Front-end React estruturado

    Back-end Node.js estruturado

    Banco PostgreSQL configurado

    Dockerfiles criados

    Docker Compose funcional

    Pipeline Jenkins configurada

    SonarQube configurado

    README documentado

Etapa 2 - Funcionalidades Avançadas ✅ (100%)

    CRUD de medicamentos completo

    Definição de horários por medicamento

    Registro de tomadas com data/hora

    Dashboard com estatísticas

    Relatório de adesão ao tratamento

    Histórico visual de tomadas

    Sistema de progresso

🔄 CI/CD Pipeline
Jenkins Pipeline Stages
groovy

├── Checkout           # Clona o código do repositório
├── SonarQube Analysis # Análise de qualidade de código
├── Build             # Build das imagens Docker
├── Test              # Execução de testes automatizados
├── Deploy            # Deploy em produção
└── Notify            # Notificação do resultado



📝 Padrões de Commit
Tipo	Descrição
feat:	Nova funcionalidade
fix:	Correção de bug
docs:	Documentação
style:	Formatação de código
refactor:	Refatoração de código
test:	Testes
chore:	Manutenção e configuração

🤝 Como Contribuir

    Faça um Fork do projeto

    Crie sua branch (git checkout -b feature/nova-feature)

    Commit suas mudanças (git commit -m 'feat: adiciona nova feature')

    Push para a branch (git push origin feature/nova-feature)

    Abra um Pull Request

📄 Licença
Este projeto está sob a licença MIT.

📧 Contato

    GitHub: @7elprado

    Projeto: MediCare Repository

<div align="center">

Desenvolvido para a disciplina de DevOps

⭐ Se este projeto te ajudou, dê uma estrela no GitHub! ⭐
