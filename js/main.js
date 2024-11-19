import { PokemonService } from './services/pokemonService.js';
import { UIManager } from './ui/uiManager.js';
import { EventManager } from './managers/eventManager.js';
import { Battle } from './components/Battle.js';

let pokemonService;
let uiManager;
let eventManager;
let battle;

async function initializeApp() {
    try {
        pokemonService = new PokemonService();
        await pokemonService.loadPokemons();
        
        battle = new Battle();
        uiManager = new UIManager(pokemonService, battle);
        eventManager = new EventManager(uiManager, pokemonService);
        
        uiManager.initializeUI();
        eventManager.setupEventListeners();
        
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);