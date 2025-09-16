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