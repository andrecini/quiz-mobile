import * as SQLite from 'expo-sqlite';

// Função para abrir o banco de dados de forma assíncrona
export const openDatabase = async (dbName: string = 'quiz.db') => {
  try {
    console.log(`Abrindo o banco de dados: ${dbName}`);
    const db = await SQLite.openDatabaseAsync(dbName);
    console.log("Banco de dados aberto com sucesso");
    return db;
  } catch (error) {
    console.error("Erro ao abrir o banco de dados", error);
    throw error;
  }
};

// Função para criar as tabelas necessárias de forma assíncrona
export const createTables = async () => {
  try {
    const db = await openDatabase();
    console.log("Criando tabelas...");

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS themes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
      );
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        themeId INTEGER,
        question TEXT,
        correctAnswer INTEGER,
        FOREIGN KEY(themeId) REFERENCES themes(id)
      );
      CREATE TABLE IF NOT EXISTS answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        questionId INTEGER,
        answer TEXT,
        isCorrect INTEGER,
        FOREIGN KEY(questionId) REFERENCES questions(id)
      );
    `);
    
    console.log("Tabelas criadas com sucesso");
  } catch (error) {
    console.error("Erro ao criar as tabelas", error);
    throw error;
  }
};

// Função para executar consultas
export const runQuery = async (query: string, params: any[] = []) => {
  try {
    const db = await openDatabase();
    console.log(`Executando consulta: ${query} com parâmetros:`, params);
    const result = await db.runAsync(query, ...params);
    console.log("Consulta executada com sucesso", result);
    return result;
  } catch (error) {
    console.error(`Erro ao executar a consulta: ${query}`, error);
    throw error;
  }
};

// Função para obter a primeira linha do resultado da consulta
export const getFirstRow = async (query: string, params: any[] = []) => {
  try {
    const db = await openDatabase();
    console.log(`Buscando a primeira linha para a consulta: ${query} com parâmetros:`, params);
    const row = await db.getFirstAsync(query, ...params);
    console.log("Primeira linha obtida com sucesso", row);
    return row;
  } catch (error) {
    console.error(`Erro ao obter a primeira linha da consulta: ${query}`, error);
    throw error;
  }
};

// Função para obter todas as linhas do resultado da consulta
export const getAllRows = async (query: string, params: any[] = []) => {
  try {
    const db = await openDatabase();
    console.log(`Buscando todas as linhas para a consulta: ${query} com parâmetros:`, params);
    const rows = await db.getAllAsync(query, ...params);
    console.log("Todas as linhas obtidas com sucesso", rows);
    return rows;
  } catch (error) {
    console.error(`Erro ao obter todas as linhas da consulta: ${query}`, error);
    throw error;
  }
};

// Função para iterar sobre as linhas da consulta
export const iterateRows = async (query: string, params: any[] = []) => {
  try {
    const db = await openDatabase();
    console.log(`Iterando sobre as linhas para a consulta: ${query} com parâmetros:`, params);
    for await (const row of db.getEachAsync(query, ...params)) {
      console.log("Linha:", row);
    }
  } catch (error) {
    console.error(`Erro ao iterar sobre as linhas da consulta: ${query}`, error);
    throw error;
  }
};
