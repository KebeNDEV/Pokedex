import { FEATURED_POKEMON } from '../config/constants.js';

export class Carousel {
    constructor() {
        this.currentIndex = 0;
        this.pokemonList = FEATURED_POKEMON;
        this.initializeElements();
        this.start();
    }

    initializeElements() {
        this.leftContainer = document.querySelector('.pokemon-carousel.left');
        this.rightContainer = document.querySelector('.pokemon-carousel.right');
    }

    start() {
        this.rotate();
        setInterval(() => this.rotate(), 5000);
    }

    rotate() {
        const pokemon1 = this.pokemonList[this.currentIndex];
        const pokemon2 = this.pokemonList[(this.currentIndex + 1) % this.pokemonList.length];
        
        this.updateImage(this.leftContainer, pokemon1);
        this.updateImage(this.rightContainer, pokemon2);
        
        this.currentIndex = (this.currentIndex + 2) % this.pokemonList.length;
    }

    updateImage(container, pokemonId) {
        const img = document.createElement('img');
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
        img.className = 'header-pokemon fade-in';
        
        container.innerHTML = '';
        container.appendChild(img);
    }
} 