import * as SQLite from 'expo-sqlite';

// Função para abrir o banco de dados de forma assíncrona
export const openDatabase = async (dbName: string = 'quiz.db') => {
  const db = await SQLite.openDatabaseAsync(dbName);
  return db;
};

// Função para criar as tabelas necessárias de forma assíncrona
export const createTables = async () => {
  const db = await openDatabase();
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
};

// Função genérica para executar consultas (execução de inserções, atualizações e exclusões)
export const runQuery = async (query: string, params: any[] = []) => {
  const db = await openDatabase();
  const result = await db.runAsync(query, ...params);
  return result;
};

// Função para obter a primeira linha de um resultado (útil para SELECT que retorna apenas uma linha)
export const getFirstRow = async (query: string, params: any[] = []) => {
  const db = await openDatabase();
  const row = await db.getFirstAsync(query, ...params);
  return row;
};

// Função para obter todas as linhas de um resultado (útil para SELECT que retorna várias linhas)
export const getAllRows = async (query: string, params: any[] = []) => {
  const db = await openDatabase();
  const rows = await db.getAllAsync(query, ...params);
  return rows;
};

// Função para iterar sobre os resultados de uma consulta (SELECT) um por vez
export const iterateRows = async (query: string, params: any[] = []) => {
  const db = await openDatabase();
  for await (const row of db.getEachAsync(query, ...params)) {
    console.log(row); // Você pode processar as linhas conforme necessário
  }
};
