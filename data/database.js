/*
 * Clase Database
 * ---------------
 * Implementa el patrón Singleton para gestionar la conexión a SQLite.
 */

class Database {
    static #db = null;
  
    constructor() {
      // No se permite instanciar con new. Hay que llamar a getInstance.
      throw new Error(
        "No se puede instanciar. Usa .getInstance() para inicializarla"
      );
    }
  
    static getInstance(dbPath) {
      if (Database.#db == null) {
        if (!dbPath) {
          throw new Error("dbPath es requerido para la primera inicialización");
        } else {
          const BetterSqlite3 = require("better-sqlite3");
          Database.#db = new BetterSqlite3(dbPath);
  
          // Inicializo la tabla de usuarios (necesaria para el login)
          require("./initialize-usuarios")(Database.#db);
  
          // Inicializo la tabla de videojuegos
          require("./initialize-videojuegos")(Database.#db);
          
        }
      }
      return Database.#db;
    }
  
    static prepare(sql) {
      return Database.#db.prepare(sql);
    }
  }
  
  module.exports = Database;