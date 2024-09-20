import * as SQLite from 'expo-sqlite';

// Abrindo o banco de dados
const db = SQLite.openDatabase('quiz.db');

// Função para criar as tabelas necessárias
export const createTables = () => {
  db.transaction(tx => {
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS themes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
      );
    `);
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        themeId INTEGER,
        question TEXT,
        correctAnswer INTEGER,
        FOREIGN KEY(themeId) REFERENCES themes(id)
      );
    `);
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        questionId INTEGER,
        answer TEXT,
        isCorrect INTEGER,
        FOREIGN KEY(questionId) REFERENCES questions(id)
      );
    `);
  });
};

// Tipos para a função dbExecute
type QueryParams = any[]; // Tipagem para os parâmetros da query
type QueryResult = SQLite.SQLResultSet; // Tipagem para o resultado da query

// Função genérica para executar queries
export const dbExecute = (query: string, params: QueryParams = []): Promise<QueryResult> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query,
        params,
        (tx, results) => {
          resolve(results);
        },
        (tx, error) => {
          console.error('SQL Error: ', error);
          reject(error);
          return false;  // O retorno deve ser false para indicar que a execução não deve continuar
        }
      );
    });
  });
};
