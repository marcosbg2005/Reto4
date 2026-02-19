document.addEventListener('DOMContentLoaded', () => {

       // LÓGICA DE FAVORITOS (LocalStorage)
    const btnToggleFavs = document.getElementById('btnToggleFavs');
    const gameCards = document.querySelectorAll('.game-card');
    
    let viewMode = 'todos'; 

    function getFavorites() {
        // Obtenemos el array de IDs del localStorage o un array vacío
        return JSON.parse(localStorage.getItem('juegosFavoritos')) || [];
    }

    function saveFavorites(favs) {
        localStorage.setItem('juegosFavoritos', JSON.stringify(favs));
    }

    function renderView() {
        const favs = getFavorites();
        
        gameCards.forEach(card => {
            const id = parseInt(card.dataset.id);
            const btnFav = card.querySelector('.btn-favorite');
            
            // Estilo de la estrella
            if (favs.includes(id)) {
                btnFav.textContent = '★'; 
                btnFav.classList.add('text-warning');
            } else {
                btnFav.textContent = '☆'; 
                btnFav.classList.remove('text-warning');
            }

            // Lógica para mostrar/ocultar según el modo
            if (viewMode === 'favoritos' && !favs.includes(id)) {
                card.style.display = 'none'; // Ocultamos si no es fav y estamos en modo favoritos
            } else {
                card.style.display = 'block'; // Mostramos todos por defecto o si es fav
            }
        });

        // Cambiamos el texto del botón según la vista actual
        if (btnToggleFavs) {
            btnToggleFavs.textContent = viewMode === 'favoritos' ? 'Ver Todos los Videojuegos' : 'Ver Solo Favoritos';
        }
    }

    // Evento para alternar la vista
    if (btnToggleFavs) {
        btnToggleFavs.addEventListener('click', () => {
            viewMode = viewMode === 'favoritos' ? 'todos' : 'favoritos';
            renderView();
        });
    }

    // Evento para hacer click en las estrellas
    document.querySelectorAll('.btn-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            let favs = getFavorites();
            
            if (favs.includes(id)) {
                favs = favs.filter(favId => favId !== id); // Lo quitamos
            } else {
                favs.push(id); // Lo añadimos
            }
            
            saveFavorites(favs);
            renderView();
        });
    });

    // Renderizado inicial al cargar la página
    renderView();


       // LÓGICA AJAX PARA FORMULARIOS
    const ajaxForms = document.querySelectorAll('.ajax-form');
    
    ajaxForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Evitamos que el navegador recargue por defecto
            
            // Preparamos los datos del formulario para enviarlos por Fetch
            const formData = new URLSearchParams(new FormData(this));
            
            fetch(this.action, {
                method: this.method,
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Al recargar la página veremos el nuevo juego. 
                    window.location.reload(); 
                } else {
                    alert('Hubo un error al procesar el formulario.');
                }
            })
            .catch(error => {
                console.error('Error AJAX:', error);
                alert('Fallo de conexión.');
            });
        });
    });

});