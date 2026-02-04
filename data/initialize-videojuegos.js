module.exports = (db) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS videojuegos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER NOT NULL,
            titulo TEXT NOT NULL,
            plataforma TEXT NOT NULL,
            genero TEXT,
            estado TEXT DEFAULT 'Pendiente', -- Pendiente, En Progreso, Completado
            fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.prepare(sql).run();
}