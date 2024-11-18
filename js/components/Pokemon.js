export class Pokemon {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.types = data.types;
        this.stats = data.stats;
        this.sprites = data.sprites;
    }

    render() {
        return `
            <div class="pokemon-card" data-id="${this.id}">
                <div class="relative">
                    <span class="pokemon-number">#${this.id.toString().padStart(3, '0')}</span>
                    <img src="${this.sprites.other['official-artwork'].front_default}" 
                         alt="${this.name}"
                         class="pokemon-image">
                </div>
                <h2 class="pokemon-name">${this.name}</h2>
                <div class="pokemon-types">
                    ${this.renderTypes()}
                </div>
                ${this.renderActions()}
            </div>
        `;
    }

    renderTypes() {
        return this.types
            .map(type => `<span class="type-badge bg-${type.type.name}">${type.type.name}</span>`)
            .join('');
    }

    renderActions() {
        return `
            <div class="pokemon-actions">
                <button class="favorite-btn" data-id="${this.id}">
                    <i class="fas fa-star"></i>
                </button>
                <button class="compare-btn" data-id="${this.id}">
                    <i class="fas fa-balance-scale"></i>
                </button>
            </div>
        `;
    }
}
