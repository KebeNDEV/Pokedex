export class StorageService {
    static getFavorites() {
        return JSON.parse(localStorage.getItem('favorites')) || [];
    }

    static setFavorites(favorites) {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    static getTheme() {
        return localStorage.getItem('theme') || 'dark';
    }

    static setTheme(theme) {
        localStorage.setItem('theme', theme);
    }
}
