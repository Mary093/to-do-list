export interface Film {
    id: number | string;
    locandina: string;
    titolo: string;
    genere: string;
    anno: number;
    durata: string;
    descrizione: string;
}

export type FilmFilter = 'all' | 'viewed' | 'unviewed';

export interface FilmService {
    getViewedFilter(): FilmFilter;
    fetchAndProcessFilms(): Promise<void>;
    addTodosAsFilms(): Promise<void>;
    loadAllData(): void;
    saveAllData(): void;
    getCatalog(): Film[];
    getSavedFilms(): Film[];
    isFilmSaved(filmId: number | string): boolean;
    isFilmViewed(filmId: number | string): boolean;
    saveFilm(film: Film): void;
    removeSavedFilm(filmId: number | string): void;
    toggleSavedFilm(film: Film): void;
    markAsViewed(filmId: number | string): void;
    unmarkAsViewed(filmId: number | string): void;
    toggleViewed(filmId: number | string): void;
    markAllSavedAsViewed(): void;
    unmarkAllSaved(): void;
    removeViewedFromSaved(): void;
    clearSaved(): void;
    deleteFromCatalog(filmId: number | string): void;
    setSearchTerm(term: string): void;
    setViewedFilter(filter: FilmFilter): void;
}