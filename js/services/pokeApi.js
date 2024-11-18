import { API_URL, POKEMON_LIMIT } from '../config/constants.js';

export async function getPokemonList() {
    try {
        const response = await fetch(`${API_URL}?limit=${POKEMON_LIMIT}`);
        const data = await response.json();
        return await Promise.all(
            data.results.map(pokemon => getPokemonDetails(pokemon.url))
        );
    } catch (error) {
        console.error('Error fetching Pokemon list:', error);
        return [];
    }
}

export async function getPokemonDetails(url) {
    const response = await fetch(url);
    return await response.json();
}
