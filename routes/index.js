var express = require('express');
var router = express.Router();
var authMiddleware = require('../middlewares/auth');
var Database = require('../data/database');
const UsuarioDAO = require("../data/usuario-dao");
const VideojuegoDAO = require('../data/videojuego-dao');

// Inicio la base de datos y los DAOs
var db = Database.getInstance("db.sqlite");
var daoUser = new UsuarioDAO(db);
var daoGames = new VideojuegoDAO(db);

/* --- RUTAS PÚBLICAS --- */

/**
 * Ruta GET /
 * Muestra la página de bienvenida
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Mi Colección' });
});

/**
 * Ruta GET /login
 * Muestra el formulario de acceso
 */
router.get('/login', function(req, res, next) {
  res.render('login', { error: null });
});

/**
 * Ruta POST /login
 * Procesa el formulario. Usuario: admin / admin
 */
router.post('/login', function(req, res, next) {
  const user = daoUser.findUserByEmail(req.body.name);

  if (!user || user.password !== req.body.password) {
      return res.render('login', { error: "Usuario o contraseña incorrectos" });
  }

  // Login correcto: guardamos usuario en sesión
  req.session.user = { id: user.id, email: user.email };
  res.redirect("/admin");
});

/**
 * Ruta GET /logout
 * Cierra sesión
 */
router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
});


/* --- RUTAS PRIVADAS (VIDEOJUEGOS) --- */

// Panel de administración con filtros (HU6)
router.get('/admin', authMiddleware, function(req, res, next) {
    const filters = {
        plataforma: req.query.plataforma || null,
        genero: req.query.genero || null,
        estado: req.query.estado || null
    };

    // Obtener juegos del usuario logueado usando los filtros
    let juegos = daoGames.findAll(req.session.user.id, filters);
    
    res.render('admin', { 
        title: 'Mi Colección', 
        user: req.session.user, 
        layout: 'layout-admin', 
        juegos: juegos,
        filters: filters 
    });
});

// Insertar juego (HU2) - ADAPTADO PARA AJAX
router.post("/games/insertar", authMiddleware, function(req, res, next) {
    daoGames.save(
        req.session.user.id,
        req.body.titulo,
        req.body.plataforma,
        req.body.genero,
        req.body.estado
    );
    
    // Comprobamos si la petición viene por AJAX (Fetch)
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({ success: true });
    }
    res.redirect("/admin");
});

// Editar juego (HU3, HU5) - ADAPTADO PARA AJAX
router.post("/games/editar", authMiddleware, function(req, res, next) {
    daoGames.update(
        req.body.id,
        req.body.titulo,
        req.body.plataforma,
        req.body.genero,
        req.body.estado
    );

    // Comprobamos si la petición viene por AJAX (Fetch)
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({ success: true });
    }
    res.redirect("/admin");
});

// Eliminar juego (HU4)
router.get("/games/delete/:id", authMiddleware, function(req, res, next) {
    daoGames.delete(req.params.id);
    res.redirect("/admin");
});

module.exports = router;