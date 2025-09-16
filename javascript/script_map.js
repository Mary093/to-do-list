let films = new Map();
let savedFilms = new Map();
let viewedFilmIds = new Set();
let currentSearchTerm = '';
let currentViewedFilter = 'all';

function loadDataFromLocalStorage() {
    try {
        const saved = localStorage.getItem('savedFilms');
        savedFilms = saved ? new Map(JSON.parse(saved).map(f => [f.id, f])) : new Map();

        const viewed = localStorage.getItem('viewedFilmIds');
        viewedFilmIds = viewed ? new Set(JSON.parse(viewed)) : new Set();
    } catch (error) {
        console.error("Errore nel caricamento da localStorage:", error);
        savedFilms = new Map();
        viewedFilmIds = new Set();
    }
}

function saveDataToLocalStorage() {
    try {
        localStorage.setItem('savedFilms', JSON.stringify(Array.from(savedFilms.values())));
        localStorage.setItem('viewedFilmIds', JSON.stringify(Array.from(viewedFilmIds)));
    } catch (error) {
        console.error("Errore nel salvataggio su localStorage:", error);
    }
}

function debounce(fn, ms) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), ms);
    };
}

function fetchAndProcessFilms() {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch('lista.json');
            if (!response.ok) {
                throw new Error('Impossibile caricare lista.json');
            }
            const filmsData = await response.json();
            console.log('Film caricati con successo.');
            resolve(filmsData);
        } catch (error) {
            console.error('Errore nel caricamento dei film:', error);
            reject([]);
        }
    });
}

async function addTodosAsFilms() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
        if (!response.ok) {
            throw new Error('Impossibile caricare i todo fittizi.');
        }
        const todos = await response.json();

        todos.forEach(todo => {
            const newFilm = {
                id: `todo-${todo.id}`,
                locandina: "https://via.placeholder.com/300x450/6c757d/ffffff?text=Todo+Item",
                titolo: todo.title,
                genere: "Todo",
                anno: new Date().getFullYear(),
                durata: "N.D.",
                descrizione: `Stato: ${todo.completed ? 'Completato' : 'Non completato'}`
            };
            savedFilms.set(newFilm.id, newFilm);
            console.log(`Todo aggiunto: "${newFilm.titolo}"`);
        });
        saveDataToLocalStorage();
    } catch (error) {
        console.error('Errore durante l\'aggiunta dei todo:', error);
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    loadDataFromLocalStorage();

    const hasTodos = Array.from(savedFilms.values()).some(film => typeof film.id === 'string' && film.id.startsWith('todo-'));
    if (savedFilms.size === 0 || !hasTodos) {
        fetchAndProcessFilms()
            .then(data => {
                films = new Map(data.map(f => [f.id, f]));
                addTodosAsFilms();
                showExploreSection();
                setupNavigation();
            })
            .catch(error => {
                console.error('Errore nel caricamento iniziale:', error);
            });
    } else {
        fetchAndProcessFilms()
            .then(data => {
                films = new Map(data.map(f => [f.id, f]));
                showExploreSection();
                setupNavigation();
            })
            .catch(error => {
                console.error('Errore nel caricamento iniziale:', error);
            });
    }
});

function setupNavigation() {
    const exploreLink = document.getElementById('explore-link');
    const myListsLink = document.getElementById('my-lists-link');

    exploreLink.addEventListener('click', function (e) {
        e.preventDefault();
        showExploreSection();
        updateActiveClass(exploreLink, myListsLink);
    });

    myListsLink.addEventListener('click', function (e) {
        e.preventDefault();
        showMyListsSection();
        updateActiveClass(myListsLink, exploreLink);
    });
}

function updateActiveClass(activeLink, inactiveLink) {
    activeLink.classList.add('active');
    inactiveLink.classList.remove('active');
}

function showExploreSection() {
    const container = document.querySelector('main.container');
    const template = document.getElementById('explore-template');
    const content = template.content.cloneNode(true);

    container.innerHTML = '';
    container.appendChild(content);

    renderFilms(Array.from(films.values()), document.getElementById('exploreList'), true);
    setupSearch();
    setupViewedFilter();
}

function showMyListsSection() {
    const container = document.querySelector('main.container');
    const template = document.getElementById('my-lists-template');
    const content = template.content.cloneNode(true);

    container.innerHTML = '';
    container.appendChild(content);

    const savedCountSpan = container.querySelector('h4 span');
    if (savedCountSpan) {
        savedCountSpan.textContent = savedFilms.size;
    }

    renderFilms(Array.from(savedFilms.values()), document.getElementById('savedList'), false);

    const markAllBtn = document.getElementById('markAllViewedBtn');
    const unmarkAllBtn = document.getElementById('unmarkAllViewedBtn');
    const removeCompletedBtn = document.getElementById('removeCompletedBtn');
    const clearBtn = document.getElementById('clearSavedBtn');
    if (markAllBtn) markAllBtn.addEventListener('click', markAllAsViewed);
    if (unmarkAllBtn) unmarkAllBtn.addEventListener('click', unmarkAllViewed);
    if (removeCompletedBtn) removeCompletedBtn.addEventListener('click', removeViewedFromSaved);
    if (clearBtn) clearBtn.addEventListener('click', clearSaved);

    const addFilmBtn = document.getElementById('addFilmBtn');
    if (addFilmBtn) {
        addFilmBtn.addEventListener('click', addFilmFromInput);
    }

    const titoloInput = document.getElementById('titolo');
    if (titoloInput && addFilmBtn) {
        titoloInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                addFilmBtn.click();
            }
        });
    }

    setupViewedFilter();
}

function createFilmElement(film, showToggle) {
    const template = document.getElementById('film-card-template');
    const card = template.content.cloneNode(true);

    const img = card.querySelector('.film-poster');
    img.src = film.locandina;
    img.alt = film.titolo;

    card.querySelector('.film-title').textContent = `${film.titolo} (${film.anno})`;
    card.querySelector('.film-genre').textContent = film.genere;
    card.querySelector('.film-duration').textContent = film.durata;
    card.querySelector('.film-description').textContent = film.descrizione;

    const titleEl = card.querySelector('.film-title');
    const actionsContainer = card.querySelector('.film-actions');
    const primaryButton = card.querySelector('.btn');
    const primarySpanText = card.querySelector('.btn span:last-child');
    const primarySpanIcon = card.querySelector('.btn span:first-child');

    if (showToggle) {
        const isSaved = savedFilms.has(film.id);
        primaryButton.classList.add(isSaved ? 'btn-success' : 'btn-primary');
        primarySpanIcon.textContent = isSaved ? 'bookmark' : 'bookmark_border';
        primarySpanText.textContent = isSaved ? 'Rimuovi' : 'Aggiungi';
        primaryButton.addEventListener('click', () => toggleSavedFilm(film.id));
    } else {
        primaryButton.classList.add('btn-danger');
        primarySpanIcon.textContent = 'delete';
        primarySpanText.textContent = 'Rimuovi';
        primaryButton.addEventListener('click', () => removeSavedFilm(film.id));
    }

    const viewedButton = document.createElement('button');
    viewedButton.className = 'btn btn-outline-secondary ms-2';
    const viewedIcon = document.createElement('span');
    viewedIcon.className = 'material-icons me-1';
    const viewedText = document.createElement('span');

    const isViewed = viewedFilmIds.has(film.id);
    viewedIcon.textContent = isViewed ? 'visibility' : 'visibility_off';
    viewedText.textContent = isViewed ? 'Visto' : 'Non visto';
    if (isViewed) {
        viewedButton.classList.remove('btn-outline-secondary');
        viewedButton.classList.add('btn-outline-success');
        titleEl.style.textDecoration = 'line-through';
    }
    viewedButton.addEventListener('click', () => toggleViewed(film.id));

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
    deleteButton.addEventListener('click', () => deleteFilm(film.id));
    actionsContainer.appendChild(deleteButton);

    return card;
}

function renderFilms(filmList, container, showToggle) {
    container.innerHTML = '';

    const filteredList = filmList.filter(film => {
        const matchesSearch = !currentSearchTerm || (
            film.titolo.toLowerCase().includes(currentSearchTerm) ||
            film.genere.toLowerCase().includes(currentSearchTerm) ||
            film.descrizione.toLowerCase().includes(currentSearchTerm)
        );
        const isViewed = viewedFilmIds.has(film.id);
        const matchesViewed = (
            currentViewedFilter === 'all' ||
            (currentViewedFilter === 'viewed' && isViewed) ||
            (currentViewedFilter === 'unviewed' && !isViewed)
        );
        return matchesSearch && matchesViewed;
    });

    if (filteredList.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                <h5>Nessun film da mostrare</h5>
                <p>${showToggle ? 'Nessun film corrisponde ai criteri correnti.' : 'Modifica i filtri o aggiungi nuovi film.'}</p>
            </div>
        `;
        return;
    }

    filteredList.forEach(film => {
        const filmElement = createFilmElement(film, showToggle);
        container.appendChild(filmElement);
    });
}

function toggleSavedFilm(filmId) {
    const film = films.get(filmId);
    if (!film) return;

    const isAlreadySaved = savedFilms.has(filmId);

    if (isAlreadySaved) {
        savedFilms.delete(filmId);
        console.log(`Film rimosso: "${film.titolo}"`);
    } else {
        savedFilms.set(filmId, film);
        console.log(`Film salvato: "${film.titolo}"`);
    }

    saveDataToLocalStorage();

    if (document.getElementById("exploreList")) {
        renderFilms(Array.from(films.values()), document.getElementById('exploreList'), true);
    }
}

function toggleViewed(filmId) {
    if (viewedFilmIds.has(filmId)) {
        viewedFilmIds.delete(filmId);
    } else {
        viewedFilmIds.add(filmId);
    }

    saveDataToLocalStorage();

    if (document.getElementById('exploreList')) {
        renderFilms(Array.from(films.values()), document.getElementById('exploreList'), true);
    }
    if (document.getElementById('savedList')) {
        renderFilms(Array.from(savedFilms.values()), document.getElementById('savedList'), false);
    }
}

function markAllAsViewed() {
    for (const film of savedFilms.values()) {
        viewedFilmIds.add(film.id);
    }
    saveDataToLocalStorage();
    renderAfterBulk();
}

function unmarkAllViewed() {
    for (const film of savedFilms.values()) {
        viewedFilmIds.delete(film.id);
    }
    saveDataToLocalStorage();
    renderAfterBulk();
}

function removeViewedFromSaved() {
    for (const filmId of viewedFilmIds) {
        savedFilms.delete(filmId);
    }
    saveDataToLocalStorage();
    renderAfterBulk();
}

function clearSaved() {
    savedFilms.clear();
    viewedFilmIds.clear();
    saveDataToLocalStorage();
    renderAfterBulk();
}

function renderAfterBulk() {
    if (document.getElementById('exploreList')) {
        renderFilms(Array.from(films.values()), document.getElementById('exploreList'), true);
    }
    if (document.getElementById('savedList')) {
        renderFilms(Array.from(savedFilms.values()), document.getElementById('savedList'), false);
        const container = document.querySelector('main.container');
        const savedCountSpan = container && container.querySelector('h4 span');
        if (savedCountSpan) {
            savedCountSpan.textContent = savedFilms.size;
        }
    }
}

function deleteFilm(filmId) {
    const initialLength = films.size;
    films.delete(filmId);

    savedFilms.delete(filmId);
    viewedFilmIds.delete(filmId);

    saveDataToLocalStorage();

    if (document.getElementById('exploreList')) {
        renderFilms(Array.from(films.values()), document.getElementById('exploreList'), true);
    }
    if (document.getElementById('savedList')) {
        renderFilms(Array.from(savedFilms.values()), document.getElementById('savedList'), false);
    }
    if (initialLength !== films.size) {
        console.log('Film eliminato dal catalogo.');
    }
}

function removeSavedFilm(filmId) {
    savedFilms.delete(filmId);
    console.log(`Film rimosso.`);
    saveDataToLocalStorage();
    showMyListsSection();
}

function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    if (searchInput) {
        const debouncedSearch = debounce(performSearch, 300);
        searchInput.addEventListener('input', debouncedSearch);
    }
}

function performSearch() {
    const searchInput = document.getElementById("searchInput");
    const resultsContainer = document.getElementById("searchResults");
    currentSearchTerm = (searchInput ? searchInput.value.toLowerCase().trim() : '');
    if (resultsContainer) resultsContainer.innerHTML = '';
    if (document.getElementById('exploreList')) {
        renderFilms(Array.from(films.values()), document.getElementById('exploreList'), true);
    }
}

function setupViewedFilter() {
    const exploreSelect = document.getElementById('viewedFilterExplore');
    const savedSelect = document.getElementById('viewedFilterSaved');

    const handler = (e) => {
        currentViewedFilter = e.target.value;
        if (document.getElementById('exploreList')) {
            renderFilms(Array.from(films.values()), document.getElementById('exploreList'), true);
        }
        if (document.getElementById('savedList')) {
            renderFilms(Array.from(savedFilms.values()), document.getElementById('savedList'), false);
        }
    };

    if (exploreSelect) {
        exploreSelect.value = currentViewedFilter;
        exploreSelect.addEventListener('change', handler);
    }
    
    if (savedSelect) {
        savedSelect.value = currentViewedFilter;
        savedSelect.addEventListener('change', handler);
    }
}
    
    function addFilm(locandina, titolo, genere, anno, durata, descrizione) {
        const newFilm = {
            id: Date.now(),
            locandina: locandina,
            titolo: titolo,
            genere: genere,
            anno: anno,
            durata: durata,
            descrizione: descrizione
        };
        savedFilms.set(newFilm.id, newFilm);
        saveDataToLocalStorage();
        console.log(`Film aggiunto: "${titolo}"`);
        showMyListsSection();
    }
    
    function addFilmFromInput() {
        const titoloInput = document.getElementById("titolo");
        const genereInput = document.getElementById("genere");
        const annoInput = document.getElementById("anno");
        const durataInput = document.getElementById("durata");
        const descrizioneInput = document.getElementById("descrizione");
    
        const titolo = titoloInput.value.trim();
        const genere = genereInput.value.trim() || "Genere Sconosciuto";
        const anno = annoInput.value.trim() || new Date().getFullYear();
        const durata = durataInput.value.trim() || "N.D.";
        const descrizione = descrizioneInput.value.trim() || "Descrizione non disponibile.";
    
        if (titolo) {
            addFilm("https://via.placeholder.com/300x450/6c757d/ffffff?text=No+Image", titolo, genere, anno, durata, descrizione);
    
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
    