export function setupEventListeners() {
    document.getElementById('buscador')?.addEventListener('input', () => window.filtrarPokemon());
    document.getElementById('filtroTipo')?.addEventListener('change', () => window.filtrarPokemon());
    document.getElementById('themeToggle')?.addEventListener('click', () => window.toggleTheme());
    
    // ... resto de los event listeners ...
} 