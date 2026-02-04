class UsuarioDAO {
    #database = null;

    constructor(database) {
        this.#database = database;
    }

    findUserByEmail(email){
        return this.#database.prepare("select * from usuarios where email = ?").get(email);
    }
}
module.exports = UsuarioDAO;