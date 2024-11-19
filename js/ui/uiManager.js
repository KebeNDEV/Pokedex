import { POKEMON_PER_PAGE } from '../config/constants.js';
import { PokemonCard } from './components/pokemonCard.js';
import { Modal } from './components/modal.js';
import { Pagination } from './components/pagination.js';

export class UIManager {
    constructor(pokemonService, battle) {
        this.pokemonService = pokemonService;
        this.battle = battle;
        this.currentPage = 1;
    }

    initializeUI() {
        this.initializePokemonTypes();
        this.showPokemons(this.pokemonService.pokemons);
    }

    initializePokemonTypes() {
        const types = this.pokemonService.getAllTypes();
        const filtroTipo = document.getElementById('filtroTipo');
        
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            filtroTipo.appendChild(option);
        });
    }

    showPokemons(pokemonList) {
        const container = document.getElementById('pokemon-container');
        container.innerHTML = '';
        
        const startIndex = (this.currentPage - 1) * POKEMON_PER_PAGE;
        const endIndex = startIndex + POKEMON_PER_PAGE;
        const pokemonToShow = pokemonList.slice(startIndex, endIndex);
        
        pokemonToShow.forEach(pokemon => {
            const card = new PokemonCard(pokemon, this);
            container.appendChild(card.render());
        });
        
        this.updatePagination(pokemonList.length);
    }

    showPokemonDetails(pokemon) {
        const modal = new Modal(pokemon);
        modal.show();
    }

    updatePagination(totalPokemon) {
        const pagination = new Pagination(
            this.currentPage,
            Math.ceil(totalPokemon / POKEMON_PER_PAGE),
            this.changePage.bind(this)
        );
        pagination.render();
    }

    changePage(newPage) {
        this.currentPage = newPage;
        this.showPokemons(this.pokemonService.pokemons);
    }

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        StorageService.setTheme(newTheme);
    }
} 