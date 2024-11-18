export const API_CONFIG = {
    baseUrl: 'https://pokeapi.co/api/v2',
    endpoints: {
        pokemon: '/pokemon',
        type: '/type',
        species: '/pokemon-species'
    },
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'
};

export const API_HEADERS = {
    'Content-Type': 'application/json'
};

export function getPokemonImageUrl(id) {
    return `${API_CONFIG.imageUrl}/${id}.png`;
}

export function getEndpointUrl(endpoint) {
    return `${API_CONFIG.baseUrl}${API_CONFIG.endpoints[endpoint]}`;
} 