import { FilmModel } from "../models/film.js";
import type { Film, FilmFilter } from "../interfaccia.js";

const SAVED_KEY = 'savedFilms';
const VIEWED_KEY = 'viewedFilmIds';

export class FilmServiceMap {
    private catalog: Map<number | string, Film> = new Map();
    private savedFilms: Map<number | string, FilmModel> = new Map();
    private viewedFilmIds: Set<number | string> = new Set();
    
    private currentSearchTerm: string = '';
    private currentViewedFilter: FilmFilter = 'all';

    public getViewedFilter(): FilmFilter {
        return this.currentViewedFilter;
    }

    async fetchAndProcessFilms(): Promise<void> {
        try {
            const response = await fetch('lista.json');
            if (!response.ok) throw new Error('Impossibile caricare lista.json');
            const filmsData: unknown = await response.json();
            
            if (Array.isArray(filmsData)) {
                this.catalog = new Map(filmsData.map((f: unknown) => {
                    if (this.isValidFilm(f)) {
                        const filmModel = new FilmModel(f.id, f.locandina, f.titolo, f.genere, f.anno, f.durata, f.descrizione);
                        return [filmModel.id, filmModel];
                    }
                    throw new Error("Dati film non validi");
                }));
                console.log('Film caricati con successo.');
            }
        } catch (error) {
            console.error('Errore nel caricamento dei film:', error);
        }
    }

    private isValidFilm(film: unknown): film is Film {
        const f = film as Film;
        return (
            (typeof f.id === 'string' || typeof f.id === 'number')
            && typeof f.locandina === 'string'
            && typeof f.titolo === 'string'
            && typeof f.genere === 'string'
            && typeof f.anno === 'number'
            && typeof f.durata === 'string'
            && typeof f.descrizione === 'string'
        );
    }

    async addTodosAsFilms(): Promise<void> {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
            if (!response.ok) throw new Error('Impossibile caricare i todo fittizi.');
            const todos: unknown = await response.json();
    
            if (Array.isArray(todos)) {
                todos.forEach((todo: { id: number; title: string; completed: boolean }) => {
                    const newFilm = new FilmModel(
                        `todo-${todo.id}`,
                        "https://via.placeholder.com/300x450/6c757d/ffffff?text=Todo+Item",
                        todo.title,
                        "Todo",
                        new Date().getFullYear(),
                        "N.D.",
                        `Stato: ${todo.completed ? 'Completato' : 'Non completato'}`
                    );
                    this.saveFilm(newFilm);
                });
                this.saveAllData();
            }
        } catch (error) {
            console.error('Errore durante l\'aggiunta dei todo:', error);
        }
    }

    loadAllData(): void {
        try {
            const saved = localStorage.getItem(SAVED_KEY);
            const savedData: unknown = saved ? JSON.parse(saved) : [];
            this.savedFilms = Array.isArray(savedData)
                ? new Map(savedData.map((f: unknown) => {
                    if (this.isValidFilm(f)) {
                        const filmModel = new FilmModel(f.id, f.locandina, f.titolo, f.genere, f.anno, f.durata, f.descrizione);
                        return [filmModel.id, filmModel];
                    }
                    throw new Error("Dati film salvati non validi");
                }))
                : new Map();

            const viewed = localStorage.getItem(VIEWED_KEY);
            const viewedData: unknown = viewed ? JSON.parse(viewed) : [];
            if (Array.isArray(viewedData)) {
                this.viewedFilmIds = new Set(viewedData as (number | string)[]);
            }
        } catch (error) {
            console.error("Errore nel caricamento da localStorage:", error);
            this.savedFilms = new Map();
            this.viewedFilmIds = new Set();
        }
    }

    saveAllData(): void {
        try {
            localStorage.setItem(SAVED_KEY, JSON.stringify(Array.from(this.savedFilms.values())));
            localStorage.setItem(VIEWED_KEY, JSON.stringify(Array.from(this.viewedFilmIds)));
        } catch (error) {
            console.error("Errore nel salvataggio su localStorage:", error);
        }
    }

    getCatalog(): Film[] {
        return this.filterFilms(Array.from(this.catalog.values()));
    }
    
    getSavedFilms(): Film[] {
        return this.filterFilms(Array.from(this.savedFilms.values()));
    }

    isFilmSaved(filmId: number | string): boolean {
        return this.savedFilms.has(filmId);
    }
    
    isFilmViewed(filmId: number | string): boolean {
        return this.viewedFilmIds.has(filmId);
    }

    saveFilm(film: Film): void {
        if (!this.isFilmSaved(film.id)) {
            this.savedFilms.set(film.id, new FilmModel(film.id, film.locandina, film.titolo, film.genere, film.anno, film.durata, film.descrizione));
            this.saveAllData();
        }
    }

    removeSavedFilm(filmId: number | string): void {
        this.savedFilms.delete(filmId);
        this.saveAllData();
    }
    
    toggleSavedFilm(film: Film): void {
        this.isFilmSaved(film.id) ? this.removeSavedFilm(film.id) : this.saveFilm(film);
    }

    markAsViewed(filmId: number | string): void {
        this.viewedFilmIds.add(filmId);
        this.saveAllData();
    }
    
    unmarkAsViewed(filmId: number | string): void {
        this.viewedFilmIds.delete(filmId);
        this.saveAllData();
    }
    
    toggleViewed(filmId: number | string): void {
        this.isFilmViewed(filmId) ? this.unmarkAsViewed(filmId) : this.markAsViewed(filmId);
    }

    markAllSavedAsViewed(): void {
        this.savedFilms.forEach(film => this.viewedFilmIds.add(film.id));
        this.saveAllData();
    }

    unmarkAllSaved(): void {
        this.savedFilms.forEach(film => this.viewedFilmIds.delete(film.id));
        this.saveAllData();
    }

    removeViewedFromSaved(): void {
        const filmsToRemove: (number | string)[] = [];
        this.savedFilms.forEach(film => {
            if (this.isFilmViewed(film.id)) {
                filmsToRemove.push(film.id);
            }
        });
        filmsToRemove.forEach(id => this.savedFilms.delete(id));
        this.saveAllData();
    }

    clearSaved(): void {
        this.savedFilms.clear();
        this.saveAllData();
    }
    
    deleteFromCatalog(filmId: number | string): void {
        this.catalog.delete(filmId);
        this.removeSavedFilm(filmId);
        this.viewedFilmIds.delete(filmId);
        this.saveAllData();
    }

    setSearchTerm(term: string): void {
        this.currentSearchTerm = term.toLowerCase().trim();
    }

    setViewedFilter(filter: FilmFilter): void {
        this.currentViewedFilter = filter;
    }

    private filterFilms(filmList: Film[]): Film[] {
        return filmList.filter(film => {
            const matchesSearch = !this.currentSearchTerm || (
                film.titolo.toLowerCase().includes(this.currentSearchTerm) ||
                film.genere.toLowerCase().includes(this.currentSearchTerm) ||
                film.descrizione.toLowerCase().includes(this.currentSearchTerm)
            );
            const isViewed = this.isFilmViewed(film.id);
            const matchesViewed = (
                this.currentViewedFilter === 'all' ||
                (this.currentViewedFilter === 'viewed' && isViewed) ||
                (this.currentViewedFilter === 'unviewed' && !isViewed)
            );
            return matchesSearch && matchesViewed;
        });
    }
}