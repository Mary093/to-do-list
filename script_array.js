let films = [];
let savedFilms = [];
let viewedFilmIds = new Set();
let currentSearchTerm = '';
let currentViewedFilter = 'all';

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
            savedFilms.push(newFilm);
            console.log(`Todo aggiunto: "${newFilm.titolo}"`);
        });
    } catch (error) {
        console.error('Errore durante l\'aggiunta dei todo:', error);
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    fetchAndProcessFilms()
        .then(data => {
            films = data;
            addTodosAsFilms();
            showExploreSection();
            setupNavigation();
        })
        .catch(error => {
            console.error('Errore nel caricamento iniziale:', error);
        });
});

// Configura navigazione
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

// Mostra sezione Esplora
function showExploreSection() {
    const container = document.querySelector('main.container');
    const template = document.getElementById('explore-template');
    const content = template.content.cloneNode(true);

    container.innerHTML = '';
    container.appendChild(content);

    renderFilms(films, document.getElementById('exploreList'), true);
    setupSearch();
    setupViewedFilter();
}

// Mostra sezione Le mie liste
function showMyListsSection() {
    const container = document.querySelector('main.container');
    const template = document.getElementById('my-lists-template');
    const content = template.content.cloneNode(true);

    container.innerHTML = '';
    container.appendChild(content);

    const savedCountSpan = container.querySelector('h4 span');
    if (savedCountSpan) {
        savedCountSpan.textContent = savedFilms.length;
    }

    renderFilms(savedFilms, document.getElementById('savedList'), false);

    // Bottoni bulk
    const markAllBtn = document.getElementById('markAllViewedBtn');
    const unmarkAllBtn = document.getElementById('unmarkAllViewedBtn');
    const removeCompletedBtn = document.getElementById('removeCompletedBtn');
    const clearBtn = document.getElementById('clearSavedBtn');
    if (markAllBtn) markAllBtn.addEventListener('click', markAllAsViewed);
    if (unmarkAllBtn) unmarkAllBtn.addEventListener('click', unmarkAllViewed);
    if (removeCompletedBtn) removeCompletedBtn.addEventListener('click', removeViewedFromSaved);
    if (clearBtn) clearBtn.addEventListener('click', clearSaved);

    // Pulsante aggiungi film
    const addFilmBtn = document.getElementById('addFilmBtn');
    if (addFilmBtn) {
        addFilmBtn.addEventListener('click', addFilmFromInput);
    }

    // Enter su input titolo → click su aggiungi
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

// Crea card film
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
        const isSaved = savedFilms.some(saved => saved.id === film.id);
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

    // Bottone "Segna come visto"
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

    // Bottone "Elimina"
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

// Renderizza lista film
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

// Aggiungi/rimuovi da salvati
function toggleSavedFilm(filmId) {
    const film = films.find(f => f.id === filmId);
    if (!film) return;

    const isAlreadySaved = savedFilms.some(saved => saved.id === filmId);

    if (isAlreadySaved) {
        savedFilms = savedFilms.filter(saved => saved.id !== filmId);
        console.log(`Film rimosso: "${film.titolo}"`);
    } else {
        savedFilms.push(film);
        console.log(`Film salvato: "${film.titolo}"`);
    }

    if (document.getElementById("exploreList")) {
        renderFilms(films, document.getElementById('exploreList'), true);
    }
}

// Segna/rimuovi visto
function toggleViewed(filmId) {
    if (viewedFilmIds.has(filmId)) {
        viewedFilmIds.delete(filmId);
    } else {
        viewedFilmIds.add(filmId);
    }
    if (document.getElementById('exploreList')) {
        renderFilms(films, document.getElementById('exploreList'), true);
    }
    if (document.getElementById('savedList')) {
        renderFilms(savedFilms, document.getElementById('savedList'), false);
    }
}

// Bulk actions
function markAllAsViewed() {
    for (const film of savedFilms) {
        viewedFilmIds.add(film.id);
    }
    renderAfterBulk();
}

function unmarkAllViewed() {
    for (const film of savedFilms) {
        viewedFilmIds.delete(film.id);
    }
    renderAfterBulk();
}

function removeViewedFromSaved() {
    savedFilms = savedFilms.filter(f => !viewedFilmIds.has(f.id));
    renderAfterBulk();
}

function clearSaved() {
    savedFilms = [];
    renderAfterBulk();
}

function renderAfterBulk() {
    if (document.getElementById('exploreList')) {
        renderFilms(films, document.getElementById('exploreList'), true);
    }
    if (document.getElementById('savedList')) {
        renderFilms(savedFilms, document.getElementById('savedList'), false);
        const container = document.querySelector('main.container');
        const savedCountSpan = container && container.querySelector('h4 span');
        if (savedCountSpan) {
            savedCountSpan.textContent = savedFilms.length;
        }
    }
}

// Elimina film ovunque
function deleteFilm(filmId) {
    const initialLength = films.length;
    films = films.filter(f => f.id !== filmId);

    savedFilms = savedFilms.filter(saved => saved.id !== filmId);
    viewedFilmIds.delete(filmId);

    if (document.getElementById('exploreList')) {
        renderFilms(films, document.getElementById('exploreList'), true);
    }
    if (document.getElementById('savedList')) {
        renderFilms(savedFilms, document.getElementById('savedList'), false);
    }
    if (initialLength !== films.length) {
        console.log('Film eliminato dal catalogo.');
    }
}

function removeSavedFilm(filmId) {
    savedFilms = savedFilms.filter(saved => saved.id !== filmId);
    console.log(`Film rimosso.`);
    showMyListsSection();
}

// Ricerca
function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    if (searchInput && searchBtn) {
        searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
}

function performSearch() {
    const searchInput = document.getElementById("searchInput");
    const resultsContainer = document.getElementById("searchResults");
    currentSearchTerm = (searchInput ? searchInput.value.toLowerCase().trim() : '');
    if (resultsContainer) resultsContainer.innerHTML = '';
    if (document.getElementById('exploreList')) {
        renderFilms(films, document.getElementById('exploreList'), true);
    }
}

// Filtri visti
function setupViewedFilter() {
    const exploreSelect = document.getElementById('viewedFilterExplore');
    const savedSelect = document.getElementById('viewedFilterSaved');

    const handler = (value) => {
        currentViewedFilter = value;
        if (document.getElementById('exploreList')) {
            renderFilms(films, document.getElementById('exploreList'), true);
        }
        if (document.getElementById('savedList')) {
            renderFilms(savedFilms, document.getElementById('savedList'), false);
        }
    };

    if (exploreSelect) {
        exploreSelect.value = currentViewedFilter;
        exploreSelect.addEventListener('change', (e) => handler(e.target.value));
    }
    if (savedSelect) {
        savedSelect.value = currentViewedFilter;
        savedSelect.addEventListener('change', (e) => handler(e.target.value));
    }
}

// Aggiungi nuovo film
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
    savedFilms.push(newFilm);
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
