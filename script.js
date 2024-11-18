const url = "https://pokeapi.co/api/v2/pokemon?limit=151";
let todosLosPokemon = [];
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
let pokemonSeleccionados = [];
let isDarkTheme = true; // Comenzamos con tema oscuro por defecto
let currentPage = 1;
const pokemonPerPage = 20; // Puedes ajustar este número

const sounds = {
    hover: new Audio('ruta/a/hover.mp3'),
    click: new Audio('ruta/a/click.mp3'),
    evolution: new Audio('ruta/a/evolution.mp3')
};

// Ajusta el volumen
Object.values(sounds).forEach(sound => {
    sound.volume = 0.3;
});

async function inicializarPokedex() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Obtener datos detallados de todos los Pokemon
        const promesas = data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
        todosLosPokemon = await Promise.all(promesas);
        
        // Inicializar filtro de tipos
        inicializarFiltroTipos();
        
        // Mostrar todos los Pokemon
        mostrarPokemons(todosLosPokemon);
        
        // Configurar eventos
        configurarEventos();
        
        // Iniciar la rotación de Pokémon en el header
        rotarPokemonHeader();
        // Establecer intervalo para rotar los Pokémon cada 5 segundos
        setInterval(rotarPokemonHeader, 5000);
        
    } catch (error) {
        console.log(error);
    }
}

function inicializarFiltroTipos() {
    const tipos = new Set();
    todosLosPokemon.forEach(pokemon => {
        pokemon.types.forEach(type => tipos.add(type.type.name));
    });
    
    const filtroTipo = document.getElementById('filtroTipo');
    [...tipos].sort().forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);
        filtroTipo.appendChild(option);
    });
}

function configurarEventos() {
    document.getElementById('buscador').addEventListener('input', filtrarPokemon);
    document.getElementById('filtroTipo').addEventListener('change', filtrarPokemon);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('startBattle').addEventListener('click', () => {
        if (pokemonSeleccionados.length === 2) {
            iniciarBatalla(pokemonSeleccionados[0], pokemonSeleccionados[1]);
        }
    });
    
    document.getElementById('resetSelection').addEventListener('click', resetSeleccion);
}

function filtrarPokemon() {
    const busqueda = document.getElementById('buscador').value.toLowerCase();
    const tipoSeleccionado = document.getElementById('filtroTipo').value;
    
    const pokemonFiltrados = todosLosPokemon.filter(pokemon => {
        const coincideNombre = pokemon.name.toLowerCase().includes(busqueda);
        const coincideTipo = tipoSeleccionado === '' || 
            pokemon.types.some(type => type.type.name === tipoSeleccionado);
        return coincideNombre && coincideTipo;
    });
    
    mostrarPokemons(pokemonFiltrados);
}

function mostrarPokemons(pokemonList) {
    const contenedor = document.getElementById('pokemon-container');
    contenedor.innerHTML = '';
    
    // Calcular el rango de Pokémon a mostrar
    const startIndex = (currentPage - 1) * pokemonPerPage;
    const endIndex = startIndex + pokemonPerPage;
    const pokemonToShow = pokemonList.slice(startIndex, endIndex);
    
    pokemonToShow.forEach(pokemon => {
        const pokemonDiv = document.createElement('div');
        pokemonDiv.className = 'pokemon-card relative bg-opacity-80 backdrop-blur-sm p-4 rounded-xl transform transition-all duration-300 hover:scale-105';
        
        pokemonDiv.innerHTML = `
            <div class="relative">
                <span class="absolute top-2 right-2 text-sm font-mono text-blue-400">
                    #${pokemon.id.toString().padStart(3, '0')}
                </span>
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" 
                     alt="${pokemon.name}"
                     class="pokemon-image w-32 h-32 mx-auto">
            </div>
            <h2 class="text-xl font-bold text-center mt-4 capitalize">${pokemon.name}</h2>
            <div class="flex justify-center gap-2 mt-2">
                ${pokemon.types.map(type => 
                    `<span class="type-badge bg-${type.type.name}">${type.type.name}</span>`
                ).join('')}
            </div>
            <div class="absolute top-2 left-2 flex gap-2">
                <button onclick="event.stopPropagation(); toggleFavorito(${pokemon.id})" 
                        class="favorite-btn">
                    <i class="fas fa-star ${favoritos.includes(pokemon.id) ? 'text-yellow-400' : 'text-gray-400'}"></i>
                </button>
                <button onclick="event.stopPropagation(); compararPokemon(${JSON.stringify(pokemon).replace(/"/g, '&quot;')})" 
                        class="compare-btn">
                    <i class="fas fa-balance-scale text-blue-400"></i>
                </button>
            </div>
        `;
        
        // Agregar evento click para mostrar detalles
        pokemonDiv.addEventListener('click', () => mostrarDetalles(pokemon));
        
        contenedor.appendChild(pokemonDiv);
    });

    // Mostrar paginación
    mostrarPaginacion(pokemonList.length);
}

function mostrarPaginacion(totalPokemon) {
    // Primero eliminamos la paginación existente si hay alguna
    const paginacionExistente = document.querySelector('.pagination');
    if (paginacionExistente) {
        paginacionExistente.remove();
    }

    const totalPages = Math.ceil(totalPokemon / pokemonPerPage);
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination flex justify-center gap-2 mt-6 mb-8';
    
    // Botón anterior
    paginationContainer.innerHTML = `
        <button onclick="cambiarPagina(${currentPage - 1})" 
                class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}"
                ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Números de página
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            paginationContainer.innerHTML += `
                <button onclick="cambiarPagina(${i})" 
                        class="pagination-btn ${i === currentPage ? 'active' : ''}">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationContainer.innerHTML += `<span class="px-2">...</span>`;
        }
    }
    
    // Botón siguiente
    paginationContainer.innerHTML += `
        <button onclick="cambiarPagina(${currentPage + 1})" 
                class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}"
                ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    document.getElementById('pokemon-container').after(paginationContainer);
}

function cambiarPagina(newPage) {
    if (newPage < 1 || newPage > Math.ceil(todosLosPokemon.length / pokemonPerPage)) return;
    currentPage = newPage;
    mostrarPokemons(todosLosPokemon);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function mostrarDetalles(pokemon) {
    const modal = document.createElement('div');
    modal.className = 'modal active fixed inset-0 z-50 overflow-y-auto';
    
    const tipos = pokemon.types.map(type => 
        `<span class="type-badge bg-${type.type.name} px-3 py-1 rounded-full text-white text-sm font-medium">
            ${type.type.name}
        </span>`
    ).join('');

    const stats = pokemon.stats.map(stat => {
        const porcentaje = (stat.base_stat / 255) * 100;
        const colorClase = porcentaje > 70 ? 'bg-green-500' : 
                          porcentaje > 40 ? 'bg-blue-500' : 'bg-red-500';
        return `
            <div class="stat-container mb-3">
                <div class="flex justify-between mb-1">
                    <span class="text-sm font-medium capitalize">${stat.stat.name}</span>
                    <span class="text-sm font-medium">${stat.base_stat}</span>
                </div>
                <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div class="${colorClase} h-full rounded-full transition-all duration-1000" 
                         style="width: ${porcentaje}%"></div>
                </div>
            </div>
        `;
    }).join('');

    // Agregar función para cerrar el modal y limpiar
    const cerrarModal = () => {
        modal.remove();
        document.body.classList.remove('modal-open');
    };

    modal.innerHTML = `
        <div class="min-h-screen px-4 text-white flex items-center justify-center">
            <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" 
                 onclick="this.closest('.modal').remove(); document.body.classList.remove('modal-open')">
            </div>
            
            <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-2xl w-full shadow-2xl relative transform transition-all duration-300 my-8">
                <div class="p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <div class="sticky top-0 z-10 flex justify-end gap-2 mb-4">
                        <button onclick="reproducirSonidoPokemon('${pokemon.name}')" 
                                class="sound-btn bg-blue-500 hover:bg-blue-600 p-2 rounded-full transition-all duration-300">
                            <i class="fas fa-volume-up text-white"></i>
                        </button>
                        <button onclick="this.closest('.modal').remove(); document.body.classList.remove('modal-open')" 
                                class="close-btn bg-red-500 hover:bg-red-600 p-2 rounded-full transition-all duration-300">
                            <i class="fas fa-times text-white"></i>
                        </button>
                    </div>

                    <div class="flex flex-col items-center mb-6">
                        <span class="text-blue-400 text-sm font-mono mb-2">
                            #${pokemon.id.toString().padStart(3, '0')}
                        </span>
                        <h2 class="text-3xl font-bold capitalize mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            ${pokemon.name}
                        </h2>
                        <div class="relative group">
                            <img src="${pokemon.sprites.other['official-artwork'].front_default}" 
                                 class="w-48 h-48 object-contain transform transition-transform duration-300 group-hover:scale-110"
                                 alt="${pokemon.name}">
                        </div>
                        <div class="flex gap-2 mt-4">
                            ${tipos}
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div class="bg-gray-800 rounded-xl p-4 text-center">
                            <p class="text-gray-400 text-sm mb-1">Altura</p>
                            <p class="text-2xl font-bold text-blue-400">${(pokemon.height / 10).toFixed(1)} m</p>
                        </div>
                        <div class="bg-gray-800 rounded-xl p-4 text-center">
                            <p class="text-gray-400 text-sm mb-1">Peso</p>
                            <p class="text-2xl font-bold text-purple-400">${(pokemon.weight / 10).toFixed(1)} kg</p>
                        </div>
                    </div>

                    <div class="bg-gray-800 rounded-xl p-6 mb-6">
                        <h3 class="text-xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            Estadísticas Base
                        </h3>
                        ${stats}
                    </div>

                    <div class="mb-6">
                        <h3 class="text-xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            Habilidades
                        </h3>
                        <div class="flex flex-wrap justify-center gap-2">
                            ${pokemon.abilities.map(ability => 
                                `<span class="bg-gray-800 px-4 py-2 rounded-full text-sm font-medium text-blue-400 hover:bg-gray-700 transition-colors duration-300">
                                    ${ability.ability.name}
                                </span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Agregar evento para cerrar con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cerrarModal();
        }
    }, { once: true });

    document.body.appendChild(modal);
    document.body.classList.add('modal-open');
}

// Función separada para reproducir el sonido
function reproducirSonidoPokemon(nombrePokemon) {
    const nombreFormateado = nombrePokemon.toLowerCase().replace(/-/g, '');
    const audio = new Audio(`https://play.pokemonshowdown.com/audio/cries/${nombreFormateado}.mp3`);
    audio.volume = 0.3;
    
    // Agregar feedback visual al botón
    const soundBtn = document.querySelector('.sound-btn');
    soundBtn.classList.add('animate-pulse');
    
    audio.play()
        .then(() => {
            // Éxito al reproducir
            setTimeout(() => soundBtn.classList.remove('animate-pulse'), 1000);
        })
        .catch(err => {
            console.log('Error al reproducir sonido:', err);
            // Feedback visual de error
            soundBtn.classList.add('bg-red-500');
            setTimeout(() => {
                soundBtn.classList.remove('animate-pulse', 'bg-red-500');
                soundBtn.classList.add('bg-blue-500');
            }, 1000);
        });
}

function crearParticulasFondo() {
    const container = document.createElement('div');
    container.className = 'particles-container';
    document.body.appendChild(container);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.animationDelay = Math.random() * 3 + 's';
        container.appendChild(particle);
    }
}

function toggleFavorito(pokemonId) {
    const index = favoritos.indexOf(pokemonId);
    if (index === -1) {
        favoritos.push(pokemonId);
    } else {
        favoritos.splice(index, 1);
    }
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    actualizarUI();
}

function compararPokemon(pokemon) {
    if (pokemonSeleccionados.length < 2) {
        pokemonSeleccionados.push(pokemon);
        actualizarSeleccionPokemon();
    }
}

function actualizarSeleccionPokemon() {
    const container1 = document.getElementById('pokemon1-selected');
    const container2 = document.getElementById('pokemon2-selected');
    const startButton = document.getElementById('startBattle');
    const resetButton = document.getElementById('resetSelection');

    // Actualizar primer contenedor
    if (pokemonSeleccionados[0]) {
        container1.innerHTML = `
            <div class="selected-pokemon">
                <img src="${pokemonSeleccionados[0].sprites.other['official-artwork'].front_default}" 
                     alt="${pokemonSeleccionados[0].name}"
                     class="animate-bounce">
                <span class="name">${pokemonSeleccionados[0].name}</span>
            </div>
        `;
        container1.closest('.selected-pokemon-container').classList.add('active');
    }

    // Actualizar segundo contenedor
    if (pokemonSeleccionados[1]) {
        container2.innerHTML = `
            <div class="selected-pokemon">
                <img src="${pokemonSeleccionados[1].sprites.other['official-artwork'].front_default}" 
                     alt="${pokemonSeleccionados[1].name}"
                     class="animate-bounce">
                <span class="name">${pokemonSeleccionados[1].name}</span>
            </div>
        `;
        container2.closest('.selected-pokemon-container').classList.add('active');
    }

    // Actualizar botones
    startButton.disabled = pokemonSeleccionados.length !== 2;
    resetButton.classList.toggle('hidden', pokemonSeleccionados.length === 0);
}

function resetSeleccion() {
    pokemonSeleccionados = [];
    const container1 = document.getElementById('pokemon1-selected');
    const container2 = document.getElementById('pokemon2-selected');
    
    container1.innerHTML = `
        <i class="fas fa-question-circle text-4xl mb-2"></i>
        <p>Selecciona el primer Pokémon</p>
    `;
    container2.innerHTML = `
        <i class="fas fa-question-circle text-4xl mb-2"></i>
        <p>Selecciona el segundo Pokémon</p>
    `;
    
    document.querySelectorAll('.selected-pokemon-container').forEach(container => {
        container.classList.remove('active');
    });
    
    actualizarSeleccionPokemon();
}

// Agregar event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startBattle').addEventListener('click', () => {
        if (pokemonSeleccionados.length === 2) {
            iniciarBatalla(pokemonSeleccionados[0], pokemonSeleccionados[1]);
        }
    });
    
    document.getElementById('resetSelection').addEventListener('click', resetSeleccion);
});

function iniciarBatalla(pokemon1, pokemon2) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    
    const stats1 = calcularStatsTotales(pokemon1);
    const stats2 = calcularStatsTotales(pokemon2);
    
    let hp1 = stats1.hp;
    let hp2 = stats2.hp;
    
    const actualizarBatalla = () => {
        const daño1 = Math.max(1, Math.floor((stats1.attack / stats2.defense) * 10));
        const daño2 = Math.max(1, Math.floor((stats2.attack / stats1.defense) * 10));
        
        hp2 -= daño1;
        hp1 -= daño2;
        
        const porcentajeHP1 = Math.max(0, (hp1 / stats1.hp) * 100);
        const porcentajeHP2 = Math.max(0, (hp2 / stats2.hp) * 100);
        
        modal.innerHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div class="bg-gray-900 rounded-xl p-8 max-w-4xl w-full">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Pokémon 1 -->
                        <div class="battle-pokemon p-4 rounded-lg bg-blue-900 bg-opacity-20">
                            <img src="${pokemon1.sprites.other['official-artwork'].front_default}" 
                                 class="w-48 h-48 mx-auto mb-4 ${hp1 <= stats1.hp * 0.2 ? 'animate-pulse' : ''}"
                                 alt="${pokemon1.name}">
                            <h3 class="text-xl font-bold text-center mb-2 capitalize">${pokemon1.name}</h3>
                            <div class="hp-bar bg-gray-700 rounded-full overflow-hidden">
                                <div class="hp-fill transition-all duration-500" 
                                     style="width: ${porcentajeHP1}%; 
                                            background: ${porcentajeHP1 > 50 ? '#48bb78' : porcentajeHP1 > 20 ? '#f6e05e' : '#f56565'}">
                                </div>
                            </div>
                            <p class="text-center mt-2">HP: ${Math.max(0, hp1)}/${stats1.hp}</p>
                        </div>

                        <!-- Pokémon 2 -->
                        <div class="battle-pokemon p-4 rounded-lg bg-purple-900 bg-opacity-20">
                            <img src="${pokemon2.sprites.other['official-artwork'].front_default}" 
                                 class="w-48 h-48 mx-auto mb-4 ${hp2 <= stats2.hp * 0.2 ? 'animate-pulse' : ''}"
                                 alt="${pokemon2.name}">
                            <h3 class="text-xl font-bold text-center mb-2 capitalize">${pokemon2.name}</h3>
                            <div class="hp-bar bg-gray-700 rounded-full overflow-hidden">
                                <div class="hp-fill transition-all duration-500" 
                                     style="width: ${porcentajeHP2}%; 
                                            background: ${porcentajeHP2 > 50 ? '#48bb78' : porcentajeHP2 > 20 ? '#f6e05e' : '#f56565'}">
                                </div>
                            </div>
                            <p class="text-center mt-2">HP: ${Math.max(0, hp2)}/${stats2.hp}</p>
                        </div>
                    </div>
                    
                    <button onclick="this.closest('.modal').remove()" 
                            class="mt-8 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors">
                        Terminar Batalla
                    </button>
                </div>
            </div>
        `;

        if (hp1 <= 0 || hp2 <= 0) {
            const ganador = hp1 > hp2 ? pokemon1 : pokemon2;
            setTimeout(() => {
                modal.innerHTML = `
                    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div class="bg-gray-900 rounded-xl p-8 max-w-lg w-full text-center">
                            <img src="${ganador.sprites.other['official-artwork'].front_default}" 
                                 class="w-48 h-48 mx-auto mb-4 animate-bounce"
                                 alt="${ganador.name}">
                            <h2 class="text-3xl font-bold mb-4">¡${ganador.name} es el ganador!</h2>
                            <button onclick="this.closest('.modal').remove()" 
                                    class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors">
                                Cerrar
                            </button>
                        </div>
                    </div>
                `;
            }, 1000);
            return;
        }

        setTimeout(actualizarBatalla, 1000);
    };

    document.body.appendChild(modal);
    actualizarBatalla();
}

function filtrosAvanzados(pokemonList) {
    return pokemonList.filter(pokemon => {
        const cumpleFiltros = {
            peso: pokemon.weight >= pesoMin && pokemon.weight <= pesoMax,
            altura: pokemon.height >= alturaMin && pokemon.height <= alturaMax,
            stats: pokemon.stats.some(stat => 
                stat.base_stat >= statMin && stat.base_stat <= statMax
            ),
            generacion: generacionesSeleccionadas.includes(
                calcularGeneracion(pokemon.id)
            )
        };
        return Object.values(cumpleFiltros).every(v => v);
    });
}

function mostrarEstadisticasAvanzadas(pokemon) {
    const statsRadar = generarGraficoRadar(pokemon.stats);
    const comparacionPromedio = compararConPromedio(pokemon.stats);
    const fortalezasDebilidades = analizarTipos(pokemon.types);
    
    return `
        <div class="stats-advanced">
            ${statsRadar}
            ${comparacionPromedio}
            ${fortalezasDebilidades}
        </div>
    `;
}

function actualizarUI() {
    // Volver a mostrar los pokemon para actualizar los iconos de favoritos
    mostrarPokemons(todosLosPokemon);
}

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    const newTheme = isDarkTheme ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Actualizar el ícono
    const themeIcon = document.querySelector('.theme-toggle i');
    themeIcon.className = isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
}

// Iniciar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    // Recuperar tema guardado
    const savedTheme = localStorage.getItem('theme') || 'dark';
    isDarkTheme = savedTheme === 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Establecer ícono inicial
    const themeIcon = document.querySelector('.theme-toggle i');
    themeIcon.className = isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
    
    // Inicializar la Pokédex
    inicializarPokedex();
    crearParticulasFondo();
});

// Configurar eventos de sonido
document.addEventListener('mouseover', (e) => {
    if (e.target.closest('.pokemon-card')) {
        sounds.hover.play();
    }
});

document.addEventListener('click', (e) => {
    if (e.target.closest('.pokemon-card')) {
        sounds.click.play();
    }
});

// Inicializar eventos de filtrado y búsqueda
configurarEventos();

// Cargar favoritos guardados
cargarFavoritos();

function calcularStatsTotales(pokemon) {
    return {
        hp: pokemon.stats.find(stat => stat.stat.name === 'hp').base_stat,
        attack: pokemon.stats.find(stat => stat.stat.name === 'attack').base_stat,
        defense: pokemon.stats.find(stat => stat.stat.name === 'defense').base_stat,
        speed: pokemon.stats.find(stat => stat.stat.name === 'speed').base_stat
    };
}

// Agregar después de las variables globales existentes
const pokemonDestacados = [25, 6, 150, 149, 9, 3, 143, 130, 131, 144, 145, 146]; // IDs de Pokémon destacados
let currentPokemonIndex = 0;

function rotarPokemonHeader() {
    const carouselLeft = document.querySelector('.pokemon-carousel.left');
    const carouselRight = document.querySelector('.pokemon-carousel.right');
    
    if (!carouselLeft || !carouselRight) {
        console.log('No se encontraron los elementos del carrusel');
        return;
    }

    const pokemonId1 = pokemonDestacados[currentPokemonIndex];
    const pokemonId2 = pokemonDestacados[(currentPokemonIndex + 1) % pokemonDestacados.length];
    
    const newImgLeft = document.createElement('img');
    const newImgRight = document.createElement('img');
    
    newImgLeft.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId1}.png`;
    newImgRight.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId2}.png`;
    
    newImgLeft.className = 'header-pokemon fade-in';
    newImgRight.className = 'header-pokemon fade-in';
    
    // Limpiar contenedores
    carouselLeft.innerHTML = '';
    carouselRight.innerHTML = '';
    
    // Agregar nuevas imágenes
    carouselLeft.appendChild(newImgLeft);
    carouselRight.appendChild(newImgRight);
    
    // Actualizar índice
    currentPokemonIndex = (currentPokemonIndex + 2) % pokemonDestacados.length;
}

// Iniciar la rotación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('Iniciando rotación de Pokémon');
    rotarPokemonHeader();
    setInterval(rotarPokemonHeader, 5000);
});


