export class PokemonHelper {
    static formatId(id) {
        return id.toString().padStart(3, '0');
    }

    static calculateBMI(weight, height) {
        return (weight / (height * height)).toFixed(2);
    }

    static getTypeColor(type) {
        const typeColors = {
            normal: '#A8A878',
            fire: '#F08030',
            water: '#6890F0',
            // ... resto de tipos
        };
        return typeColors[type] || '#777';
    }

    static calculateStats(pokemon) {
        const stats = {
            total: 0,
            highest: { name: '', value: 0 },
            lowest: { name: '', value: Infinity }
        };

        pokemon.stats.forEach(stat => {
            const value = stat.base_stat;
            stats.total += value;

            if (value > stats.highest.value) {
                stats.highest = { name: stat.stat.name, value };
            }
            if (value < stats.lowest.value) {
                stats.lowest = { name: stat.stat.name, value };
            }
        });

        return stats;
    }

    static getGenerationFromId(id) {
        if (id <= 151) return 1;
        if (id <= 251) return 2;
        if (id <= 386) return 3;
        if (id <= 493) return 4;
        if (id <= 649) return 5;
        if (id <= 721) return 6;
        if (id <= 809) return 7;
        return 8;
    }
}

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
} 