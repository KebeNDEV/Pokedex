import { API_CONFIG } from '../config/api.js';

export async function initializePokedex() {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}/pokemon?limit=151`);
        const data = await response.json();
        
        const promesas = data.results.map(pokemon => 
            fetch(pokemon.url).then(res => res.json())
        );
        window.todosLosPokemon = await Promise.all(promesas);
        
        initializePokemonTypes();
        showPokemons(window.todosLosPokemon);
        
    } catch (error) {
        console.error('Error initializing pokedex:', error);
    }
}

export function showPokemons(pokemonList) {
    // ... código original de mostrarPokemons ...
}

// Exporta las funciones que necesitan ser globales
window.mostrarPokemons = showPokemons;
window.filtrarPokemon = filterPokemon;
window.toggleFavorito = toggleFavorite;
window.compararPokemon = comparePokemon;
window.cambiarPagina = changePage;
// ... otras funciones que necesiten ser globales 