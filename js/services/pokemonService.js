import { API_URL, POKEMON_LIMIT } from '../config/constants.js';
import { StorageService } from './storage.js';
import { PokemonFilter } from '../utils/filters.js';

export class PokemonService {
    constructor() {
        this.pokemons = [];
        this.favorites = StorageService.getFavorites();
        this.currentPage = 1;
    }

    async loadPokemons() {
        const response = await fetch(`${API_URL}?limit=${POKEMON_LIMIT}`);
        const data = await response.json();
        
        const promises = data.results.map(pokemon => 
            fetch(pokemon.url).then(res => res.json())
        );
        this.pokemons = await Promise.all(promises);
    }

    getAllTypes() {
        const types = new Set();
        this.pokemons.forEach(pokemon => {
            pokemon.types.forEach(type => types.add(type.type.name));
        });
        return [...types].sort();
    }

    filterPokemons(searchTerm, selectedType) {
        const filter = new PokemonFilter(this.pokemons)
            .setNameFilter(searchTerm)
            .setTypeFilter(selectedType);
        
        return filter.apply();
    }

    toggleFavorite(pokemonId) {
        const index = this.favorites.indexOf(pokemonId);
        if (index === -1) {
            this.favorites.push(pokemonId);
        } else {
            this.favorites.splice(index, 1);
        }
        StorageService.setFavorites(this.favorites);
    }

    isFavorite(pokemonId) {
        return this.favorites.includes(pokemonId);
    }
} 