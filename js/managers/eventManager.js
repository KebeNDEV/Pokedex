export class EventManager {
    constructor(uiManager, pokemonService) {
        this.uiManager = uiManager;
        this.pokemonService = pokemonService;
    }

    setupEventListeners() {
        document.getElementById('buscador')
            .addEventListener('input', () => this.handleSearch());
        
        document.getElementById('filtroTipo')
            .addEventListener('change', () => this.handleSearch());
        
        document.getElementById('themeToggle')
            .addEventListener('click', () => this.uiManager.toggleTheme());
    }

    handleSearch() {
        const searchTerm = document.getElementById('buscador').value;
        const selectedType = document.getElementById('filtroTipo').value;
        
        const filteredPokemon = this.pokemonService
            .filterPokemons(searchTerm, selectedType);
        
        this.uiManager.currentPage = 1;
        this.uiManager.showPokemons(filteredPokemon);
    }
} 