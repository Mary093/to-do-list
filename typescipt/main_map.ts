import { FilmModel } from './models/film.js';
import type { Film } from './interfaccia.js';
import { FilmServiceMap } from './services/film-services_map.js';

const filmService = new FilmServiceMap();

function debounce(fn: (...args: unknown[]) => void, ms: number): (...args: unknown[]) => void {
    let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
    return (...args: unknown[]) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), ms);
    };
}

document.addEventListener('DOMContentLoaded', async function () {
    filmService.loadAllData();
    await filmService.fetchAndProcessFilms();
    await filmService.addTodosAsFilms();
    showExploreSection();
    setupNavigation();
});

function setupNavigation(): void {
    const exploreLink = document.getElementById('explore-link');
    const myListsLink = document.getElementById('my-lists-link');

    exploreLink?.addEventListener('click', (e) => {
        e.preventDefault();
        showExploreSection();
        updateActiveClass(exploreLink, myListsLink);
    });

    myListsLink?.addEventListener('click', (e) => {
        e.preventDefault();
        showMyListsSection();
        updateActiveClass(myListsLink, exploreLink);
    });
}

function updateActiveClass(activeLink: HTMLElement | null, inactiveLink: HTMLElement | null): void {
    activeLink?.classList.add('active');
    inactiveLink?.classList.remove('active');
}

function showExploreSection(): void {
    const container = document.querySelector('main.container');
    const template = document.getElementById('explore-template') as HTMLTemplateElement;
    const content = template.content.cloneNode(true);

    if (container) {
        container.innerHTML = '';
        container.appendChild(content);
        renderFilms(filmService.getCatalog(), document.getElementById('exploreList'), true);
        setupSearch();
        setupViewedFilter('explore');
    }
}

function showMyListsSection(): void {
    const container = document.querySelector('main.container');
    const template = document.getElementById('my-lists-template') as HTMLTemplateElement;
    const content = template.content.cloneNode(true);

    if (container) {
        container.innerHTML = '';
        container.appendChild(content);

        const savedCountSpan = container.querySelector('h4 span');
        if (savedCountSpan) savedCountSpan.textContent = filmService.getSavedFilms().length.toString();

        renderFilms(filmService.getSavedFilms(), document.getElementById('savedList'), false);

        const markAllBtn = document.getElementById('markAllViewedBtn');
        const unmarkAllBtn = document.getElementById('unmarkAllViewedBtn');
        const removeCompletedBtn = document.getElementById('removeCompletedBtn');
        const clearBtn = document.getElementById('clearSavedBtn');

        markAllBtn?.addEventListener('click', () => { filmService.markAllSavedAsViewed(); renderAfterBulk(); });
        unmarkAllBtn?.addEventListener('click', () => { filmService.unmarkAllSaved(); renderAfterBulk(); });
        removeCompletedBtn?.addEventListener('click', () => { filmService.removeViewedFromSaved(); renderAfterBulk(); });
        clearBtn?.addEventListener('click', () => { filmService.clearSaved(); renderAfterBulk(); });
        
        const addFilmBtn = document.getElementById('addFilmBtn');
        addFilmBtn?.addEventListener('click', addFilmFromInput);
        
        const titoloInput = document.getElementById('titolo') as HTMLInputElement;
        if (titoloInput && addFilmBtn) {
            titoloInput.addEventListener('keyup', (event) => {
                if (event.key === 'Enter') addFilmBtn.click();
            });
        }
        
        setupViewedFilter('saved');
    }
}

function createFilmElement(film: Film, showToggle: boolean): DocumentFragment {
    const template = document.getElementById('film-card-template') as HTMLTemplateElement;
    const card = template.content.cloneNode(true) as DocumentFragment;

    const img = card.querySelector('.film-poster') as HTMLImageElement;
    img.src = film.locandina;
    img.alt = film.titolo;

    const titleEl = card.querySelector('.film-title') as HTMLElement;
    titleEl.textContent = `${film.titolo} (${film.anno})`;

    const genreEl = card.querySelector('.film-genre') as HTMLElement;
    genreEl.textContent = film.genere;

    const durationEl = card.querySelector('.film-duration') as HTMLElement;
    durationEl.textContent = film.durata;

    const descriptionEl = card.querySelector('.film-description') as HTMLElement;
    descriptionEl.textContent = film.descrizione;

    const actionsContainer = card.querySelector('.film-actions') as HTMLElement;
    const primaryButton = card.querySelector('.btn') as HTMLButtonElement;
    const primarySpanText = primaryButton.querySelector('span:last-child') as HTMLElement;
    const primarySpanIcon = primaryButton.querySelector('span:first-child') as HTMLElement;

    if (showToggle) {
        const isSaved = filmService.isFilmSaved(film.id);
        primaryButton.classList.add(isSaved ? 'btn-success' : 'btn-primary');
        primarySpanIcon.textContent = isSaved ? 'bookmark' : 'bookmark_border';
        primarySpanText.textContent = isSaved ? 'Rimuovi' : 'Aggiungi';
        primaryButton.addEventListener('click', () => {
            filmService.toggleSavedFilm(film);
            renderExplore();
        });
    } else {
        primaryButton.classList.add('btn-danger');
        primarySpanIcon.textContent = 'delete';
        primarySpanText.textContent = 'Rimuovi';
        primaryButton.addEventListener('click', () => {
            filmService.removeSavedFilm(film.id);
            showMyListsSection();
        });
    }

    const viewedButton = document.createElement('button');
    viewedButton.className = 'btn btn-outline-secondary ms-2';
    const viewedIcon = document.createElement('span');
    viewedIcon.className = 'material-icons me-1';
    const viewedText = document.createElement('span');

    const isViewed = filmService.isFilmViewed(film.id);
    viewedIcon.textContent = isViewed ? 'visibility' : 'visibility_off';
    viewedText.textContent = isViewed ? 'Visto' : 'Non visto';
    if (isViewed) {
        viewedButton.classList.remove('btn-outline-secondary');
        viewedButton.classList.add('btn-outline-success');
        titleEl.style.textDecoration = 'line-through';
    }
    viewedButton.addEventListener('click', () => {
        filmService.toggleViewed(film.id);
        if (document.getElementById('exploreList')) renderExplore();
        if (document.getElementById('savedList')) renderSaved();
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

function renderFilms(filmList: Film[], container: HTMLElement | null, showToggle: boolean): void {
    if (!container) return;
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

function renderExplore(): void {
    renderFilms(filmService.getCatalog(), document.getElementById('exploreList'), true);
}

function renderSaved(): void {
    const savedCountSpan = document.querySelector('main.container h4 span');
    if (savedCountSpan) savedCountSpan.textContent = filmService.getSavedFilms().length.toString();
    renderFilms(filmService.getSavedFilms(), document.getElementById('savedList'), false);
}

function renderAfterBulk(): void {
    renderExplore();
    renderSaved();
}

function setupSearch(): void {
    const searchInput = document.getElementById("searchInput") as HTMLInputElement;
    const searchBtn = document.getElementById("searchBtn");

    searchBtn?.addEventListener('click', performSearch);
    
    if (searchInput) {
        const debouncedSearch = debounce(performSearch, 300);
        searchInput.addEventListener('input', debouncedSearch);
    }
}

function performSearch(): void {
    const searchInput = document.getElementById("searchInput") as HTMLInputElement;
    filmService.setSearchTerm(searchInput?.value || '');
    renderExplore();
}

function setupViewedFilter(section: 'explore' | 'saved'): void {
    const selectId = section === 'explore' ? 'viewedFilterExplore' : 'viewedFilterSaved';
    const select = document.getElementById(selectId) as HTMLSelectElement;

    const handler = (e: Event) => {
        const target = e.target as HTMLSelectElement;
        filmService.setViewedFilter(target.value as 'all' | 'viewed' | 'unviewed');
        if (section === 'explore') renderExplore();
        if (section === 'saved') renderSaved();
    };

    if (select) {
        select.value = filmService.getViewedFilter();
        select.addEventListener('change', handler);
    }
}

function addFilmFromInput(): void {
    const titoloInput = document.getElementById("titolo") as HTMLInputElement;
    const genereInput = document.getElementById("genere") as HTMLInputElement;
    const annoInput = document.getElementById("anno") as HTMLInputElement;
    const durataInput = document.getElementById("durata") as HTMLInputElement;
    const descrizioneInput = document.getElementById("descrizione") as HTMLInputElement;

    const titolo = titoloInput.value.trim();
    const genere = genereInput.value.trim() || "Genere Sconosciuto";
    const anno = parseInt(annoInput.value.trim(), 10) || new Date().getFullYear();
    const durata = durataInput.value.trim() || "N.D.";
    const descrizione = descrizioneInput.value.trim() || "Descrizione non disponibile.";

    if (titolo) {
        const newFilm = new FilmModel(
            Date.now(),
            "https://via.placeholder.com/300x450/6c757d/ffffff?text=No+Image",
            titolo,
            genere,
            anno,
            durata,
            descrizione
        );
        filmService.saveFilm(newFilm);
        showMyListsSection();

        titoloInput.value = "";
        genereInput.value = "";
        annoInput.value = "";
        durataInput.value = "";
        descrizioneInput.value = "";
        titoloInput.focus();
    } else {
        alert("Inserisci almeno il titolo del film!");
    }
}