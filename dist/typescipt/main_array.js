import { FilmModel } from './models/film.js';
import { FilmServiceArray } from './services/film-services_array.js';
const filmService = new FilmServiceArray();
//ritarda l'esecuzione di una funzione fino a quando non è trascorso un certo periodo di inattività
function debounce(fn, ms) {
    let timeout = undefined;
    return (...args) => {
        if (timeout)
            clearTimeout(timeout); //Se esiste timeout lo cancella usando clearTimeout. Questo "resetta" il conto alla rovescia
        timeout = setTimeout(() => fn(...args), ms);
    };
}
// Qui avvengono tutte le inizializzazioni
document.addEventListener('DOMContentLoaded', async function () {
    filmService.loadAllData(); //carica i dati dell'utente precedentemente salvati nel localStorage
    await filmService.fetchAndProcessFilms(); //mette in puasa l'esecuzione per scaricare e processare la lista dei film dal file lista.json
    await filmService.addTodosAsFilms();
    showExploreSection();
    setupNavigation(); //configurati tutti i gestori di eventi necessari per la navigazione
});
function setupNavigation() {
    const exploreLink = document.getElementById('explore-link');
    const myListsLink = document.getElementById('my-lists-link');
    exploreLink?.addEventListener('click', (e) => {
        e.preventDefault(); //metodo che impedisce il comportamento predefinito di un evento.
        showExploreSection();
        updateActiveClass(exploreLink, myListsLink);
    });
    myListsLink?.addEventListener('click', (e) => {
        e.preventDefault();
        showMyListsSection();
        updateActiveClass(myListsLink, exploreLink);
    });
}
// Aggiorna le classi CSS per mostrare quale link di navigazione è attivo.
function updateActiveClass(activeLink, inactiveLink) {
    activeLink?.classList.add('active');
    inactiveLink?.classList.remove('active');
}
function showExploreSection() {
    const container = document.querySelector('main.container');
    const template = document.getElementById('explore-template');
    const content = template.content.cloneNode(true);
    if (container) {
        container.innerHTML = ''; // cancella tutto il contenuto HTML attualmente presente all'interno del container
        container.appendChild(content); //aggiunge un nuovo elemento come ultimo figlio di un elemento genitore esistente nella struttura HTML 
        renderFilms(filmService.getCatalog(), document.getElementById('exploreList'), true);
        setupSearch();
        setupViewedFilter('explore');
    }
}
function showMyListsSection() {
    const container = document.querySelector('main.container');
    const template = document.getElementById('my-lists-template');
    const content = template.content.cloneNode(true);
    if (container) {
        container.innerHTML = '';
        container.appendChild(content);
        const savedCountSpan = container.querySelector('h4 span');
        if (savedCountSpan)
            savedCountSpan.textContent = filmService.getSavedFilms().length.toString();
        renderFilms(filmService.getSavedFilms(), document.getElementById('savedList'), false); //false serve a filtrare la lista
        const markAllBtn = document.getElementById('markAllViewedBtn');
        const unmarkAllBtn = document.getElementById('unmarkAllViewedBtn');
        const removeCompletedBtn = document.getElementById('removeCompletedBtn');
        const clearBtn = document.getElementById('clearSavedBtn');
        // Aggiunge i listener per i pulsanti. Ogni click chiama il metodo del servizio e poi aggiorna la UI.
        markAllBtn?.addEventListener('click', () => { filmService.markAllSavedAsViewed(); renderAfterBulk(); }); //renderAfterBulk= richiama renderExplore() e renderSaved()
        unmarkAllBtn?.addEventListener('click', () => { filmService.unmarkAllSaved(); renderAfterBulk(); });
        removeCompletedBtn?.addEventListener('click', () => { filmService.removeViewedFromSaved(); renderAfterBulk(); });
        clearBtn?.addEventListener('click', () => { filmService.clearSaved(); renderAfterBulk(); });
        const addFilmBtn = document.getElementById('addFilmBtn');
        addFilmBtn?.addEventListener('click', addFilmFromInput);
        const titoloInput = document.getElementById('titolo');
        if (titoloInput && addFilmBtn) {
            titoloInput.addEventListener('keyup', (event) => {
                if (event.key === 'Enter')
                    addFilmBtn.click();
            });
        }
        setupViewedFilter('saved');
    }
}
function createFilmElement(film, showToggle) {
    const template = document.getElementById('film-card-template');
    const card = template.content.cloneNode(true);
    const img = card.querySelector('.film-poster');
    img.src = film.locandina;
    img.alt = film.titolo;
    const titleEl = card.querySelector('.film-title');
    titleEl.textContent = `${film.titolo} (${film.anno})`;
    const genreEl = card.querySelector('.film-genre');
    genreEl.textContent = film.genere;
    const durationEl = card.querySelector('.film-duration');
    durationEl.textContent = film.durata;
    const descriptionEl = card.querySelector('.film-description');
    descriptionEl.textContent = film.descrizione;
    // Gestione dei pulsanti di azione
    const actionsContainer = card.querySelector('.film-actions');
    const primaryButton = card.querySelector('.btn');
    const primarySpanText = primaryButton.querySelector('span:last-child');
    const primarySpanIcon = primaryButton.querySelector('span:first-child');
    // Logica per il pulsante "Aggiungi/Rimuovi" che dipende dalla sezione in cui ci troviamo
    if (showToggle) {
        const isSaved = filmService.isFilmSaved(film.id);
        primaryButton.classList.add(isSaved ? 'btn-success' : 'btn-primary');
        primarySpanIcon.textContent = isSaved ? 'bookmark' : 'bookmark_border';
        primarySpanText.textContent = isSaved ? 'Rimuovi' : 'Aggiungi';
        primaryButton.addEventListener('click', () => {
            filmService.toggleSavedFilm(film);
            renderExplore();
        });
    }
    else {
        primaryButton.classList.add('btn-danger');
        primarySpanIcon.textContent = 'delete';
        primarySpanText.textContent = 'Rimuovi';
        primaryButton.addEventListener('click', () => {
            filmService.removeSavedFilm(film.id);
            showMyListsSection();
        });
    }
    // Crea e configura il pulsante "Visto/Non visto"
    const viewedButton = document.createElement('button');
    viewedButton.className = 'btn btn-outline-secondary ms-2';
    const viewedIcon = document.createElement('span');
    viewedIcon.className = 'material-icons me-1';
    const viewedText = document.createElement('span');
    // Aggiorna testo, icona e stile in base allo stato "visto".
    const isViewed = filmService.isFilmViewed(film.id);
    viewedIcon.textContent = isViewed ? 'visibility' : 'visibility_off';
    viewedText.textContent = isViewed ? 'Visto' : 'Non visto';
    if (isViewed) {
        viewedButton.classList.remove('btn-outline-secondary');
        viewedButton.classList.add('btn-outline-success');
        titleEl.style.textDecoration = 'line-through';
    }
    // Aggiunge un listener che cambia lo stato e rirende la sezione corrente
    viewedButton.addEventListener('click', () => {
        filmService.toggleViewed(film.id);
        if (document.getElementById('exploreList'))
            renderExplore();
        if (document.getElementById('savedList'))
            renderSaved();
    });
    viewedButton.appendChild(viewedIcon);
    viewedButton.appendChild(viewedText);
    actionsContainer.appendChild(viewedButton);
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger ms-2';
    const deleteIcon = document.createElement('span');
    deleteIcon.className = 'material-icons me-1';
    deleteIcon.textContent = 'delete_forever';
    const deleteText = document.createElement('span');
    deleteText.textContent = 'Elimina';
    deleteButton.appendChild(deleteIcon);
    deleteButton.appendChild(deleteText);
    deleteButton.addEventListener('click', () => {
        filmService.deleteFromCatalog(film.id);
        renderExplore();
        renderSaved();
    });
    actionsContainer.appendChild(deleteButton);
    return card;
}
// Funzione principale che prende una lista di film e li rende nel container specificato
function renderFilms(filmList, container, showToggle) {
    if (!container)
        return;
    container.innerHTML = '';
    if (filmList.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                <h5>Nessun film da mostrare</h5>
                <p>${showToggle ? 'Nessun film corrisponde ai criteri correnti.' : 'Modifica i filtri o aggiungi nuovi film.'}</p>
            </div>
        `;
        return;
    }
    filmList.forEach(film => {
        const filmElement = createFilmElement(film, showToggle);
        container.appendChild(filmElement);
    });
}
// Funzione di utilità per ri-renderizzare la sezione "Esplora"
function renderExplore() {
    renderFilms(filmService.getCatalog(), document.getElementById('exploreList'), true);
}
// Funzione di utilità per ri-renderizzare la sezione "Liste Salvate"
function renderSaved() {
    const savedCountSpan = document.querySelector('main.container h4 span');
    if (savedCountSpan)
        savedCountSpan.textContent = filmService.getSavedFilms().length.toString();
    renderFilms(filmService.getSavedFilms(), document.getElementById('savedList'), false); //false per "interruttore" bottone
}
// Funzione di utilità per ri-renderizzare entrambe le sezioni dopo un'azione massiva
function renderAfterBulk() {
    renderExplore();
    renderSaved();
}
// Configura i gestori di eventi per la barra di ricerca
function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    searchBtn?.addEventListener('click', performSearch);
    if (searchInput) {
        const debouncedSearch = debounce(performSearch, 300); // Utilizza il debounce per ritardare la ricerca mentre l'utente digita
        searchInput.addEventListener('input', debouncedSearch);
    }
}
// Esegue la ricerca, chiedendo al servizio di aggiornare il termine di ricerca e poi renderizza la sezione Esplora
function performSearch() {
    const searchInput = document.getElementById("searchInput");
    filmService.setSearchTerm(searchInput?.value || '');
    renderExplore();
}
// Configura il filtro per i film visti/non visti
function setupViewedFilter(section) {
    const selectId = section === 'explore' ? 'viewedFilterExplore' : 'viewedFilterSaved';
    const select = document.getElementById(selectId);
    const handler = (e) => {
        const target = e.target;
        filmService.setViewedFilter(target.value);
        if (section === 'explore')
            renderExplore();
        if (section === 'saved')
            renderSaved();
    };
    if (select) {
        select.value = filmService.getViewedFilter();
        select.addEventListener('change', handler); // si riferisce a un evento e alla funzione che lo gestisce
    }
}
// Gestisce l'aggiunta di un nuovo film dalla sezione "Le mie liste".
function addFilmFromInput() {
    const titoloInput = document.getElementById("titolo");
    const genereInput = document.getElementById("genere");
    const annoInput = document.getElementById("anno");
    const durataInput = document.getElementById("durata");
    const descrizioneInput = document.getElementById("descrizione");
    const titolo = titoloInput.value.trim();
    const genere = genereInput.value.trim() || "Genere Sconosciuto";
    const anno = parseInt(annoInput.value.trim(), 10) || new Date().getFullYear();
    const durata = durataInput.value.trim() || "N.D.";
    const descrizione = descrizioneInput.value.trim() || "Descrizione non disponibile.";
    if (titolo) {
        const newFilm = new FilmModel(Date.now(), "https://via.placeholder.com/300x450/6c757d/ffffff?text=No+Image", titolo, genere, anno, durata, descrizione);
        filmService.saveFilm(newFilm);
        showMyListsSection();
        titoloInput.value = "";
        genereInput.value = "";
        annoInput.value = "";
        durataInput.value = "";
        descrizioneInput.value = "";
        titoloInput.focus(); //imposta il focus su un elemento di input HTML
    }
    else {
        alert("Inserisci almeno il titolo del film!");
    }
}
