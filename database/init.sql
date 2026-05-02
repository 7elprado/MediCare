-- Script inicial de criação do banco de dados
CREATE DATABASE IF NOT EXISTS medicare_db;
\c medicare_db;

-- Executar migrations
\i migrations/001_create_usuarios.sql
\i migrations/002_create_medicamentos.sql
