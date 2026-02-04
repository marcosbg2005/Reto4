class VideojuegoDAO {
    #database = null;

    constructor(database) {
        this.#database = database;
    }

    // Obtener juegos con filtros opcionales
    findAll(userId, filters = {}) {
        let sql = `SELECT * FROM videojuegos WHERE id_usuario = ?`;
        const params = [userId];

        if (filters.plataforma) {
            sql += ` AND plataforma = ?`;
            params.push(filters.plataforma);
        }
        if (filters.genero) {
            sql += ` AND genero LIKE ?`;
            params.push(`%${filters.genero}%`);
        }
        if (filters.estado) {
            sql += ` AND estado = ?`;
            params.push(filters.estado);
        }

        return this.#database.prepare(sql).all(...params);
    }

    // Crear (HU2)
    save(id_usuario, titulo, plataforma, genero, estado) {
        const sql = `INSERT INTO videojuegos (id_usuario, titulo, plataforma, genero, estado) VALUES (?, ?, ?, ?, ?)`;
        return this.#database.prepare(sql).run(id_usuario, titulo, plataforma, genero, estado);
    }

    // Editar (HU3, HU5)
    update(id, titulo, plataforma, genero, estado) {
        const sql = `UPDATE videojuegos SET titulo = ?, plataforma = ?, genero = ?, estado = ? WHERE id = ?`;
        return this.#database.prepare(sql).run(titulo, plataforma, genero, estado, id);
    }

    // Eliminar (HU4)
    delete(id) {
        const sql = `DELETE FROM videojuegos WHERE id = ?`;
        return this.#database.prepare(sql).run(id);
    }
    
    findById(id) {
        return this.#database.prepare("SELECT * FROM videojuegos WHERE id = ?").get(id);
    }
}

module.exports = VideojuegoDAO;