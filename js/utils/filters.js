export class PokemonFilter {
    constructor(pokemonList) {
        this.pokemonList = pokemonList;
        this.filters = {
            name: '',
            type: '',
            minWeight: 0,
            maxWeight: Infinity,
            minHeight: 0,
            maxHeight: Infinity
        };
    }

    setNameFilter(name) {
        this.filters.name = name.toLowerCase();
        return this;
    }

    setTypeFilter(type) {
        this.filters.type = type.toLowerCase();
        return this;
    }

    setWeightRange(min, max) {
        this.filters.minWeight = min;
        this.filters.maxWeight = max;
        return this;
    }

    setHeightRange(min, max) {
        this.filters.minHeight = min;
        this.filters.maxHeight = max;
        return this;
    }

    apply() {
        return this.pokemonList.filter(pokemon => {
            const nameMatch = pokemon.name.toLowerCase().includes(this.filters.name);
            const typeMatch = !this.filters.type || 
                pokemon.types.some(type => type.type.name === this.filters.type);
            const weightMatch = pokemon.weight >= this.filters.minWeight && 
                pokemon.weight <= this.filters.maxWeight;
            const heightMatch = pokemon.height >= this.filters.minHeight && 
                pokemon.height <= this.filters.maxHeight;

            return nameMatch && typeMatch && weightMatch && heightMatch;
        });
    }
}

export function sortPokemon(pokemonList, criteria = 'id', direction = 'asc') {
    return [...pokemonList].sort((a, b) => {
        let valueA = a[criteria];
        let valueB = b[criteria];

        if (criteria === 'stats') {
            valueA = a.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
            valueB = b.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
        }

        return direction === 'asc' ? valueA - valueB : valueB - valueA;
    });
} 