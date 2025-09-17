import { FilmModel } from "../models/film.js";
// chiavi per il salvataggio in localStorage.
const SAVED_KEY = 'savedFilms';
const VIEWED_KEY = 'viewedFilmIds';
export class FilmServiceArray {
    constructor() {
        this.catalog = [];
        this.savedFilms = [];
        this.viewedFilmIds = new Set();
        // Variabili per mantenere lo stato dei filtri di ricerca e visualizzazione.
        this.currentSearchTerm = '';
        this.currentViewedFilter = 'all';
    }
    getViewedFilter() {
        return this.currentViewedFilter;
    }
    // Carica i film dal file lista.json e popola il catalogo.
    async fetchAndProcessFilms() {
        try {
            const response = await fetch('lista.json');
            if (!response.ok)
                throw new Error('Impossibile caricare lista.json');
            const filmsData = await response.json();
            if (Array.isArray(filmsData)) { //Controlla se i dati ottenuti (filmsData) sono effettivamente un array
                this.catalog = filmsData.map((f) => {
                    if (this.isValidFilm(f)) {
                        return new FilmModel(f.id, f.locandina, f.titolo, f.genere, f.anno, f.durata, f.descrizione);
                    }
                    throw new Error("Dati film non validi");
                });
                console.log('Film caricati con successo.');
            }
        }
        catch (error) {
            console.error('Errore nel caricamento dei film:', error);
        }
    }
    // Metodo per validare i dati di un film
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
                    const newFilm = new FilmModel(`todo-${todo.id}`, "https://via.placeholder.com/300x450/6c757d/ffffff?text=Todo+Item", todo.title, "Todo", new Date().getFullYear(), //restituisce l'anno corrente come un numero di 4 cifre
                    "N.D.", `Stato: ${todo.completed ? 'Completato' : 'Non completato'}`);
                    this.saveFilm(newFilm);
                });
                this.saveAllData(); //funzione di salvataggio nel localStorage
            }
        }
        catch (error) {
            console.error('Errore durante l\'aggiunta dei todo:', error);
        }
    }
    // Carica i film salvati e gli ID dei film visti da localStorage.
    loadAllData() {
        try {
            const saved = localStorage.getItem(SAVED_KEY);
            const savedData = saved ? JSON.parse(saved) : [];
            this.savedFilms = Array.isArray(savedData)
                ? savedData.map((f) => {
                    if (this.isValidFilm(f)) {
                        return new FilmModel(f.id, f.locandina, f.titolo, f.genere, f.anno, f.durata, f.descrizione);
                    }
                    throw new Error("Dati film salvati non validi");
                })
                : [];
            const viewed = localStorage.getItem(VIEWED_KEY);
            const viewedData = viewed ? JSON.parse(viewed) : []; //controlla se la variabile viewed è "vera"
            if (Array.isArray(viewedData)) {
                this.viewedFilmIds = new Set(viewedData);
            }
        }
        catch (error) {
            console.error("Errore nel caricamento da localStorage:", error);
            this.savedFilms = [];
            this.viewedFilmIds = new Set(); //reimpostano i dati a un valore vuoto 
        }
    }
    saveAllData() {
        try {
            localStorage.setItem(SAVED_KEY, JSON.stringify(this.savedFilms));
            localStorage.setItem(VIEWED_KEY, JSON.stringify(Array.from(this.viewedFilmIds))); //Array.from= prende oggetto e lo converte in un array standard
        }
        catch (error) {
            console.error("Errore nel salvataggio su localStorage:", error);
        }
    }
    getCatalog() {
        return this.filterFilms(this.catalog);
    }
    getSavedFilms() {
        return this.filterFilms(this.savedFilms);
    }
    isFilmSaved(filmId) {
        return this.savedFilms.some(f => f.id === filmId); //.some= restituisce true non appena trova almeno un elemento che soddisfa la condizione specificata.
    }
    isFilmViewed(filmId) {
        return this.viewedFilmIds.has(filmId); //.has= per controllare se l'ID del film è già presente nella collezione. 
    }
    // Aggiunge un film salvato
    saveFilm(film) {
        if (!this.isFilmSaved(film.id)) {
            this.savedFilms.push(new FilmModel(film.id, film.locandina, film.titolo, film.genere, film.anno, film.durata, film.descrizione));
            this.saveAllData();
        }
    }
    removeSavedFilm(filmId) {
        this.savedFilms = this.savedFilms.filter(f => f.id !== filmId); //.filter()` per creare un nuovo array senza l'elemento.
        this.saveAllData();
    }
    // Inverte lo stato di salvataggio di un film
    toggleSavedFilm(film) {
        this.isFilmSaved(film.id) ? this.removeSavedFilm(film.id) : this.saveFilm(film);
    }
    //segna come visto
    markAsViewed(filmId) {
        this.viewedFilmIds.add(filmId);
        this.saveAllData();
    }
    unmarkAsViewed(filmId) {
        this.viewedFilmIds.delete(filmId);
        this.saveAllData();
    }
    //gestisce l'azione di segnare o desegnare un film come visto con un unico interruttore.
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
        this.savedFilms = this.savedFilms.filter(f => !this.isFilmViewed(f.id));
        this.saveAllData();
    }
    //dalla lista dei preferiti salvati
    clearSaved() {
        this.savedFilms = [];
        this.saveAllData();
    }
    //rimuovere completamente un film dall'intero catalogo e da tutte le liste associate.
    deleteFromCatalog(filmId) {
        this.catalog = this.catalog.filter(f => f.id !== filmId);
        this.removeSavedFilm(filmId);
        this.viewedFilmIds.delete(filmId);
        this.saveAllData();
    }
    //ricerca
    setSearchTerm(term) {
        this.currentSearchTerm = term.toLowerCase().trim();
    }
    //filtro per la visualizzazione dei film visti
    setViewedFilter(filter) {
        this.currentViewedFilter = filter;
    }
    // Metodo per filtri di ricerca e visualizzazione
    filterFilms(filmList) {
        return filmList.filter(film => {
            const matchesSearch = !this.currentSearchTerm || ( //controlla se il film corrisponde al termine di ricerca corrente
            film.titolo.toLowerCase().includes(this.currentSearchTerm) || //.includes= per confontare
                film.genere.toLowerCase().includes(this.currentSearchTerm) ||
                film.descrizione.toLowerCase().includes(this.currentSearchTerm));
            const isViewed = this.isFilmViewed(film.id);
            const matchesViewed = ( //stato di visualizzazione
            this.currentViewedFilter === 'all' ||
                (this.currentViewedFilter === 'viewed' && isViewed) ||
                (this.currentViewedFilter === 'unviewed' && !isViewed));
            return matchesSearch && matchesViewed;
        });
    }
}
