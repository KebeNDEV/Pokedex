import { API_URL, POKEMON_LIMIT } from './config/constants.js';
import { getPokemonList } from './services/pokeApi.js';
import { initializeCarousel } from './components/Carousel.js';
import { initializeBattle } from './components/Battle.js';
import { setupTheme } from './utils/helpers.js';
import { setupFilters } from './utils/filters.js';
import { initializeStorage } from './services/storage.js';

class PokemonApp {
    constructor() {
        this.pokemonList = [];
        this.currentPage = 1;
        this.favorites = [];
        this.selectedPokemons = [];
    }

    async initialize() {
        try {
            // Inicializar servicios
            await this.loadPokemonData();
            initializeStorage();
            setupTheme();
            
            // Inicializar componentes
            initializeCarousel();
            initializeBattle();
            setupFilters();
            
            // Renderizar vista inicial
            this.renderPokemonList();
            
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }

    async loadPokemonData() {
        this.pokemonList = await getPokemonList();
    }

    renderPokemonList() {
        const container = document.getElementById('pokemon-container');
        const start = (this.currentPage - 1) * POKEMON_PER_PAGE;
        const end = start + POKEMON_PER_PAGE;
        const pokemonsToShow = this.pokemonList.slice(start, end);

        container.innerHTML = pokemonsToShow.map(pokemon => `
            <div class="pokemon-card" data-id="${pokemon.id}">
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" 
                     alt="${pokemon.name}"
                     class="pokemon-image">
                <h2 class="pokemon-name">${pokemon.name}</h2>
                <div class="pokemon-types">
                    ${pokemon.types.map(type => 
                        `<span class="type-badge bg-${type.type.name}">
                            ${type.type.name}
                        </span>`
                    ).join('')}
                </div>
            </div>
        `).join('');
    }
}

// Inicializar app cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new PokemonApp();
    app.initialize();
}); 