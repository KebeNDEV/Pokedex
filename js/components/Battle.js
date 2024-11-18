export class Battle {
    constructor() {
        this.selectedPokemons = [];
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.battleButton = document.getElementById('startBattle');
        this.resetButton = document.getElementById('resetSelection');
        this.container1 = document.getElementById('pokemon1-selected');
        this.container2 = document.getElementById('pokemon2-selected');
    }

    bindEvents() {
        this.battleButton.addEventListener('click', () => this.startBattle());
        this.resetButton.addEventListener('click', () => this.resetSelection());
    }

    selectPokemon(pokemon) {
        if (this.selectedPokemons.length >= 2) return;
        
        this.selectedPokemons.push(pokemon);
        this.updateUI();
    }

    startBattle() {
        if (this.selectedPokemons.length !== 2) return;
        // Lógica de batalla
    }

    resetSelection() {
        this.selectedPokemons = [];
        this.updateUI();
    }

    updateUI() {
        // Actualizar UI con Pokémon seleccionados
    }
} 