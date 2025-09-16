import type { Film } from "../interfaccia.js";

export class FilmModel implements Film {
    id: number | string;
    locandina: string;
    titolo: string;
    genere: string;
    anno: number;
    durata: string;
    descrizione: string;

    constructor(
        id: number | string,
        locandina: string,
        titolo: string,
        genere: string,
        anno: number,
        durata: string,
        descrizione: string
    ) {
        this.id = id;
        this.locandina = locandina;
        this.titolo = titolo;
        this.genere = genere;
        this.anno = anno;
        this.durata = durata;
        this.descrizione = descrizione;
    }
}