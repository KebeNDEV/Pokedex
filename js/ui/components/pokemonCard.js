export class PokemonCard {
    constructor(pokemon, uiManager) {
        this.pokemon = pokemon;
        this.uiManager = uiManager;
    }

    render() {
        const div = document.createElement('div');
        div.className = 'pokemon-card';
        
        // ... código del card ...
        
        return div;
    }
} 