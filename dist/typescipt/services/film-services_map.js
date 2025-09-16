import { FilmModel } from "../models/film.js";
const SAVED_KEY = 'savedFilms';
const VIEWED_KEY = 'viewedFilmIds';
export class FilmServiceMap {
    constructor() {
        this.catalog = new Map();
        this.savedFilms = new Map();
        this.viewedFilmIds = new Set();
        this.currentSearchTerm = '';
        this.currentViewedFilter = 'all';
    }
    getViewedFilter() {
        return this.currentViewedFilter;
    }
    async fetchAndProcessFilms() {
        try {
            const response = await fetch('lista.json');
            if (!response.ok)
                throw new Error('Impossibile caricare lista.json');
            const filmsData = await response.json();
            if (Array.isArray(filmsData)) {
                this.catalog = new Map(filmsData.map((f) => {
                    if (this.isValidFilm(f)) {
                        const filmModel = new FilmModel(f.id, f.locandina, f.titolo, f.genere, f.anno, f.durata, f.descrizione);
                        return [filmModel.id, filmModel];
                    }
                    throw new Error("Dati film non validi");
                }));
                console.log('Film caricati con successo.');
            }
        }
        catch (error) {
            console.error('Errore nel caricamento dei film:', error);
        }
    }
    isValidFilm(film) {
        const f = film;
        return ((typeof f.id === 'string' || typeof f.id === 'number')
            && typeof f.locandina === 'string'
            && typeof f.titolo === 'string'
            && typeof f.genere === 'string'
            && typeof f.anno === 'number'
            && typeof f.durata === 'string'
            && typeof f.descrizione === 'string');
    }
    async addTodosAsFilms() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
            if (!response.ok)
                throw new Error('Impossibile caricare i todo fittizi.');
            const todos = await response.json();
            if (Array.isArray(todos)) {
                todos.forEach((todo) => {
                    const newFilm = new FilmModel(`todo-${todo.id}`, "https://via.placeholder.com/300x450/6c757d/ffffff?text=Todo+Item", todo.title, "Todo", new Date().getFullYear(), "N.D.", `Stato: ${todo.completed ? 'Completato' : 'Non completato'}`);
                    this.saveFilm(newFilm);
                });
                this.saveAllData();
            }
        }
        catch (error) {
            console.error('Errore durante l\'aggiunta dei todo:', error);
        }
    }
    loadAllData() {
        try {
            const saved = localStorage.getItem(SAVED_KEY);
            const savedData = saved ? JSON.parse(saved) : [];
            this.savedFilms = Array.isArray(savedData)
                ? new Map(savedData.map((f) => {
                    if (this.isValidFilm(f)) {
                        const filmModel = new FilmModel(f.id, f.locandina, f.titolo, f.genere, f.anno, f.durata, f.descrizione);
                        return [filmModel.id, filmModel];
                    }
                    throw new Error("Dati film salvati non validi");
                }))
                : new Map();
            const viewed = localStorage.getItem(VIEWED_KEY);
            const viewedData = viewed ? JSON.parse(viewed) : [];
            if (Array.isArray(viewedData)) {
                this.viewedFilmIds = new Set(viewedData);
            }
        }
        catch (error) {
            console.error("Errore nel caricamento da localStorage:", error);
            this.savedFilms = new Map();
            this.viewedFilmIds = new Set();
        }
    }
    saveAllData() {
        try {
            localStorage.setItem(SAVED_KEY, JSON.stringify(Array.from(this.savedFilms.values())));
            localStorage.setItem(VIEWED_KEY, JSON.stringify(Array.from(this.viewedFilmIds)));
        }
        catch (error) {
            console.error("Errore nel salvataggio su localStorage:", error);
        }
    }
    getCatalog() {
        return this.filterFilms(Array.from(this.catalog.values()));
    }
    getSavedFilms() {
        return this.filterFilms(Array.from(this.savedFilms.values()));
    }
    isFilmSaved(filmId) {
        return this.savedFilms.has(filmId);
    }
    isFilmViewed(filmId) {
        return this.viewedFilmIds.has(filmId);
    }
    saveFilm(film) {
        if (!this.isFilmSaved(film.id)) {
            this.savedFilms.set(film.id, new FilmModel(film.id, film.locandina, film.titolo, film.genere, film.anno, film.durata, film.descrizione));
            this.saveAllData();
        }
    }
    removeSavedFilm(filmId) {
        this.savedFilms.delete(filmId);
        this.saveAllData();
    }
    toggleSavedFilm(film) {
        this.isFilmSaved(film.id) ? this.removeSavedFilm(film.id) : this.saveFilm(film);
    }
    markAsViewed(filmId) {
        this.viewedFilmIds.add(filmId);
        this.saveAllData();
    }
    unmarkAsViewed(filmId) {
        this.viewedFilmIds.delete(filmId);
        this.saveAllData();
    }
    toggleViewed(filmId) {
        this.isFilmViewed(filmId) ? this.unmarkAsViewed(filmId) : this.markAsViewed(filmId);
    }
    markAllSavedAsViewed() {
        this.savedFilms.forEach(film => this.viewedFilmIds.add(film.id));
        this.saveAllData();
    }
    unmarkAllSaved() {
        this.savedFilms.forEach(film => this.viewedFilmIds.delete(film.id));
        this.saveAllData();
    }
    removeViewedFromSaved() {
        const filmsToRemove = [];
        this.savedFilms.forEach(film => {
            if (this.isFilmViewed(film.id)) {
                filmsToRemove.push(film.id);
            }
        });
        filmsToRemove.forEach(id => this.savedFilms.delete(id));
        this.saveAllData();
    }
    clearSaved() {
        this.savedFilms.clear();
        this.saveAllData();
    }
    deleteFromCatalog(filmId) {
        this.catalog.delete(filmId);
        this.removeSavedFilm(filmId);
        this.viewedFilmIds.delete(filmId);
        this.saveAllData();
    }
    setSearchTerm(term) {
        this.currentSearchTerm = term.toLowerCase().trim();
    }
    setViewedFilter(filter) {
        this.currentViewedFilter = filter;
    }
    filterFilms(filmList) {
        return filmList.filter(film => {
            const matchesSearch = !this.currentSearchTerm || (film.titolo.toLowerCase().includes(this.currentSearchTerm) ||
                film.genere.toLowerCase().includes(this.currentSearchTerm) ||
                film.descrizione.toLowerCase().includes(this.currentSearchTerm));
            const isViewed = this.isFilmViewed(film.id);
            const matchesViewed = (this.currentViewedFilter === 'all' ||
                (this.currentViewedFilter === 'viewed' && isViewed) ||
                (this.currentViewedFilter === 'unviewed' && !isViewed));
            return matchesSearch && matchesViewed;
        });
    }
}
