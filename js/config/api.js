export const API_CONFIG = {
    baseUrl: 'https://pokeapi.co/api/v2',
    imageBaseUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'
};

export const API_HEADERS = {
    'Content-Type': 'application/json'
};

export function getPokemonImageUrl(id) {
    return `${API_CONFIG.imageBaseUrl}/${id}.png`;
}

export function getEndpointUrl(endpoint) {
    return `${API_CONFIG.baseUrl}${API_CONFIG.endpoints[endpoint]}`;
} 