export class Modal {
    constructor(pokemon) {
        this.pokemon = pokemon;
    }

    show() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        
        // ... código del modal ...
        
        document.body.appendChild(modal);
    }
} 