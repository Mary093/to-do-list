<<<<<<< HEAD
let filmsMap = new Map();
let savedFilms = new Map();
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
            const data = await response.json();
            const filmsMap = new Map(data.map(film => [film.id, film]));
            console.log('Film caricati con successo.');
            resolve(filmsMap); 
        } catch (error) {
            console.error('Errore nel caricamento dei film:', error);
            reject(new Map()); 
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
    } catch (error) {
        console.error('Errore durante l\'aggiunta dei todo:', error);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    fetchAndProcessFilms()
        .then(dataMap => {
            filmsMap = dataMap;
            addTodosAsFilms();
            showExploreSection();
            setupNavigation();
        })
        .catch(error => {
            console.error('Errore nel caricamento iniziale:', error);
        });
});


// Funzione per configurare la navigazione
function setupNavigation() {
    const exploreLink = document.getElementById('explore-link');
    const myListsLink = document.getElementById('my-lists-link');
    
    exploreLink.addEventListener('click', function(e) {
        e.preventDefault();
        showExploreSection();
        updateActiveClass(exploreLink, myListsLink);
    });
    
    myListsLink.addEventListener('click', function(e) {
        e.preventDefault();
        showMyListsSection();
        updateActiveClass(myListsLink, exploreLink);
    });
}

function updateActiveClass(activeLink, inactiveLink) {
    activeLink.classList.add('active');
    inactiveLink.classList.remove('active');
}

// Funzione per mostrare la sezione Esplora
function showExploreSection() {
    const container = document.querySelector('main.container');
    const template = document.getElementById('explore-template');
    const content = template.content.cloneNode(true);
    
    container.innerHTML = '';
    container.appendChild(content);
    
    renderFilms(Array.from(filmsMap.values()), document.getElementById('exploreList'), true);
    setupSearch();
    setupViewedFilter();
}

// Funzione per mostrare la sezione Le mie liste
function showMyListsSection() {
    const container = document.querySelector('main.container');
    const template = document.getElementById('my-lists-template');
    const content = template.content.cloneNode(true);

    container.innerHTML = '';
    container.appendChild(content);

    const savedCountSpan = container.querySelector('h4 span');
    if (savedCountSpan) {
        let savedCount = 0;
        for (const _ of savedFilms.values()) {
            savedCount++;
        }
        savedCountSpan.textContent = savedCount;
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
    setupViewedFilter();
}

// Funzione per clonare e popolare un singolo film
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
    const descEl = card.querySelector('.film-description');

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

    // Elimina sempre dal catalogo (anche se visualizzato in "Le mie liste")
    deleteButton.addEventListener('click', () => deleteFilm(film.id));
    actionsContainer.appendChild(deleteButton);
    
    return card;
}

// Funzione generica per renderizzare una lista di film
function renderFilms(filmList, container, showToggle) {
    container.innerHTML = '';
    
    // Applica filtri e ricerca direttamente in render
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

// Funzione per aggiungere/rimuovere film dalla lista salvata
function toggleSavedFilm(filmId) {
    const isAlreadySaved = savedFilms.has(filmId);
    
    if (isAlreadySaved) {
        savedFilms.delete(filmId);
        console.log(`Film rimosso: "${filmsMap.get(filmId).titolo}"`);
    } else {
        const film = filmsMap.get(filmId);
        if (!film) return;
        savedFilms.set(filmId, film);
        console.log(`Film salvato: "${film.titolo}"`);
    }
    
    if (document.getElementById("exploreList")) {
        renderFilms(Array.from(filmsMap.values()), document.getElementById('exploreList'), true);
    }
}

// Funzione per segnare/rimuovere come visto
function toggleViewed(filmId) {
    if (viewedFilmIds.has(filmId)) {
        viewedFilmIds.delete(filmId);
    } else {
        viewedFilmIds.add(filmId);
    }
    if (document.getElementById('exploreList')) {
        renderFilms(Array.from(filmsMap.values()), document.getElementById('exploreList'), true);
    }
    if (document.getElementById('savedList')) {
        renderFilms(Array.from(savedFilms.values()), document.getElementById('savedList'), false);
    }
}

// Segna tutti i salvati come visti
function markAllAsViewed() {
    for (const film of savedFilms.values()) {
        viewedFilmIds.add(film.id);
    }
    renderAfterBulk();
}

// Deseleziona (segna come non visti) tutti i salvati
function unmarkAllViewed() {
    for (const film of savedFilms.values()) {
        if (viewedFilmIds.has(film.id)) {
            viewedFilmIds.delete(film.id);
        }
    }
    renderAfterBulk();
}

// Rimuovi i salvati che sono stati segnati come visti
function removeViewedFromSaved() {
    for (const [filmId] of Array.from(savedFilms.entries())) {
        if (viewedFilmIds.has(filmId)) {
            savedFilms.delete(filmId);
        }
    }
    renderAfterBulk();
}

// Svuota completamente la lista salvati
function clearSaved() {
    savedFilms.clear();
    renderAfterBulk();
}

function renderAfterBulk() {
    if (document.getElementById('exploreList')) {
        renderFilms(Array.from(filmsMap.values()), document.getElementById('exploreList'), true);
    }
    if (document.getElementById('savedList')) {
        renderFilms(Array.from(savedFilms.values()), document.getElementById('savedList'), false);
        const container = document.querySelector('main.container');
        const savedCountSpan = container && container.querySelector('h4 span');
        if (savedCountSpan) {
            let savedCount = 0;
            for (const _ of savedFilms.values()) savedCount++;
            savedCountSpan.textContent = savedCount;
        }
    }
}

// Funzione per eliminare completamente un film (dal catalogo e dall'UI)
function deleteFilm(filmId) {
    // Rimuovi dal catalogo principali (filmsMap)
    filmsMap.delete(filmId);
    // Rimuovi da salvati e da visti
    savedFilms.delete(filmId);
    if (viewedFilmIds.has(filmId)) viewedFilmIds.delete(filmId);

    // Aggiorna UI corrente
    if (document.getElementById('exploreList')) {
        renderFilms(Array.from(filmsMap.values()), document.getElementById('exploreList'), true);
    }
    if (document.getElementById('savedList')) {
        renderFilms(Array.from(savedFilms.values()), document.getElementById('savedList'), false);
    }
    console.log('Film eliminato dal catalogo.');
}

// Funzione per rimuovere film dalla lista salvata
function removeSavedFilm(filmId) {
    savedFilms.delete(filmId);
    console.log(`Film rimosso.`);
    showMyListsSection();
}

// Funzione per configurare la ricerca
function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// Funzione per eseguire la ricerca
function performSearch() {
    const searchInput = document.getElementById("searchInput");
    const resultsContainer = document.getElementById("searchResults");
    currentSearchTerm = (searchInput ? searchInput.value.toLowerCase().trim() : '');
    if (resultsContainer) resultsContainer.innerHTML = '';

    if (document.getElementById('exploreList')) {
        renderFilms(Array.from(filmsMap.values()), document.getElementById('exploreList'), true);
    }
}

// Gestione filtro Visti/Non visti/Tutti
function setupViewedFilter() {
    const exploreSelect = document.getElementById('viewedFilterExplore');
    const savedSelect = document.getElementById('viewedFilterSaved');

    const handler = (value) => {
        currentViewedFilter = value;
        if (document.getElementById('exploreList')) {
            renderFilms(Array.from(filmsMap.values()), document.getElementById('exploreList'), true);
        }
        if (document.getElementById('savedList')) {
            renderFilms(Array.from(savedFilms.values()), document.getElementById('savedList'), false);
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

// Funzione per aggiungere un nuovo film personalizzato
function addFilm(locandina, titolo, genere, anno, durata, descrizione) {
    const newFilmId = Date.now();
    const newFilm = {
        id: newFilmId, 
        locandina: locandina,
        titolo: titolo,
        genere: genere,
        anno: anno,
        durata: durata,
        descrizione: descrizione
    };
    savedFilms.set(newFilmId, newFilm);
    console.log(`Film aggiunto: "${titolo}"`);
    showMyListsSection();
}

// Funzione che gestisce l'input e chiama la funzione di aggiunta
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
        
        // Pulisce tutti i campi dopo l'aggiunta
        titoloInput.value = "";
        genereInput.value = "";
        annoInput.value = "";
        durataInput.value = "";
        descrizioneInput.value = "";
    } else {
        alert("Inserisci almeno il titolo del film!");
    }
=======
let filmsMap = new Map();
let savedFilms = new Map();
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
            const data = await response.json();
            const filmsMap = new Map(data.map(film => [film.id, film]));
            console.log('Film caricati con successo.');
            resolve(filmsMap); 
        } catch (error) {
            console.error('Errore nel caricamento dei film:', error);
            reject(new Map()); 
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
    } catch (error) {
        console.error('Errore durante l\'aggiunta dei todo:', error);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    fetchAndProcessFilms()
        .then(dataMap => {
            filmsMap = dataMap;
            addTodosAsFilms();
            showExploreSection();
            setupNavigation();
        })
        .catch(error => {
            console.error('Errore nel caricamento iniziale:', error);
        });
});


// Funzione per configurare la navigazione
function setupNavigation() {
    const exploreLink = document.getElementById('explore-link');
    const myListsLink = document.getElementById('my-lists-link');
    
    exploreLink.addEventListener('click', function(e) {
        e.preventDefault();
        showExploreSection();
        updateActiveClass(exploreLink, myListsLink);
    });
    
    myListsLink.addEventListener('click', function(e) {
        e.preventDefault();
        showMyListsSection();
        updateActiveClass(myListsLink, exploreLink);
    });
}

function updateActiveClass(activeLink, inactiveLink) {
    activeLink.classList.add('active');
    inactiveLink.classList.remove('active');
}

// Funzione per mostrare la sezione Esplora
function showExploreSection() {
    const container = document.querySelector('main.container');
    const template = document.getElementById('explore-template');
    const content = template.content.cloneNode(true);
    
    container.innerHTML = '';
    container.appendChild(content);
    
    renderFilms(Array.from(filmsMap.values()), document.getElementById('exploreList'), true);
    setupSearch();
}

// Funzione per mostrare la sezione Le mie liste
function showMyListsSection() {
    const container = document.querySelector('main.container');
    const template = document.getElementById('my-lists-template');
    const content = template.content.cloneNode(true);

    container.innerHTML = '';
    container.appendChild(content);

    const savedCountSpan = container.querySelector('h4 span');
    if (savedCountSpan) {
        let savedCount = 0;
        for (const _ of savedFilms.values()) {
            savedCount++;
        }
        savedCountSpan.textContent = savedCount;
    }
    
    renderFilms(Array.from(savedFilms.values()), document.getElementById('savedList'), false);

    const markAllBtn = document.getElementById('markAllViewedBtn');
    const removeCompletedBtn = document.getElementById('removeCompletedBtn');
    const clearBtn = document.getElementById('clearSavedBtn');
    if (markAllBtn) markAllBtn.addEventListener('click', markAllAsViewed);
    if (removeCompletedBtn) removeCompletedBtn.addEventListener('click', removeViewedFromSaved);
    if (clearBtn) clearBtn.addEventListener('click', clearSaved);
}

// Funzione per clonare e popolare un singolo film
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
    const descEl = card.querySelector('.film-description');

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

    // Elimina sempre dal catalogo (anche se visualizzato in "Le mie liste")
    deleteButton.addEventListener('click', () => deleteFilm(film.id));
    actionsContainer.appendChild(deleteButton);
    
    return card;
}

// Funzione generica per renderizzare una lista di film
function renderFilms(filmList, container, showToggle) {
    container.innerHTML = '';
    
    // Applica filtri e ricerca direttamente in render
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

// Funzione per aggiungere/rimuovere film dalla lista salvata
function toggleSavedFilm(filmId) {
    const isAlreadySaved = savedFilms.has(filmId);
    
    if (isAlreadySaved) {
        savedFilms.delete(filmId);
        console.log(`Film rimosso: "${filmsMap.get(filmId).titolo}"`);
    } else {
        const film = filmsMap.get(filmId);
        if (!film) return;
        savedFilms.set(filmId, film);
        console.log(`Film salvato: "${film.titolo}"`);
    }
    
    if (document.getElementById("exploreList")) {
        renderFilms(Array.from(filmsMap.values()), document.getElementById('exploreList'), true);
    }
}

// Funzione per segnare/rimuovere come visto
function toggleViewed(filmId) {
    if (viewedFilmIds.has(filmId)) {
        viewedFilmIds.delete(filmId);
    } else {
        viewedFilmIds.add(filmId);
    }
    if (document.getElementById('exploreList')) {
        renderFilms(Array.from(filmsMap.values()), document.getElementById('exploreList'), true);
    }
    if (document.getElementById('savedList')) {
        renderFilms(Array.from(savedFilms.values()), document.getElementById('savedList'), false);
    }
}

// Segna tutti i salvati come visti
function markAllAsViewed() {
    for (const film of savedFilms.values()) {
        viewedFilmIds.add(film.id);
    }
    renderAfterBulk();
}

// Rimuovi i salvati che sono stati segnati come visti
function removeViewedFromSaved() {
    for (const [filmId] of Array.from(savedFilms.entries())) {
        if (viewedFilmIds.has(filmId)) {
            savedFilms.delete(filmId);
        }
    }
    renderAfterBulk();
}

// Svuota completamente la lista salvati
function clearSaved() {
    savedFilms.clear();
    renderAfterBulk();
}

function renderAfterBulk() {
    if (document.getElementById('exploreList')) {
        renderFilms(Array.from(filmsMap.values()), document.getElementById('exploreList'), true);
    }
    if (document.getElementById('savedList')) {
        renderFilms(Array.from(savedFilms.values()), document.getElementById('savedList'), false);
        const container = document.querySelector('main.container');
        const savedCountSpan = container && container.querySelector('h4 span');
        if (savedCountSpan) {
            let savedCount = 0;
            for (const _ of savedFilms.values()) savedCount++;
            savedCountSpan.textContent = savedCount;
        }
    }
}

// Funzione per eliminare completamente un film (dal catalogo e dall'UI)
function deleteFilm(filmId) {
    // Rimuovi dal catalogo principali (filmsMap)
    filmsMap.delete(filmId);
    // Rimuovi da salvati e da visti
    savedFilms.delete(filmId);
    if (viewedFilmIds.has(filmId)) viewedFilmIds.delete(filmId);

    // Aggiorna UI corrente
    if (document.getElementById('exploreList')) {
        renderFilms(Array.from(filmsMap.values()), document.getElementById('exploreList'), true);
    }
    if (document.getElementById('savedList')) {
        renderFilms(Array.from(savedFilms.values()), document.getElementById('savedList'), false);
    }
    console.log('Film eliminato dal catalogo.');
}

// Funzione per rimuovere film dalla lista salvata
function removeSavedFilm(filmId) {
    savedFilms.delete(filmId);
    console.log(`Film rimosso.`);
    showMyListsSection();
}

// Funzione per configurare la ricerca
function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// Funzione per eseguire la ricerca
function performSearch() {
    const searchInput = document.getElementById("searchInput");
    const resultsContainer = document.getElementById("searchResults");
    currentSearchTerm = (searchInput ? searchInput.value.toLowerCase().trim() : '');
    if (resultsContainer) resultsContainer.innerHTML = '';

    if (document.getElementById('exploreList')) {
        renderFilms(Array.from(filmsMap.values()), document.getElementById('exploreList'), true);
    }
}

// Funzione per aggiungere un nuovo film personalizzato
function addFilm(locandina, titolo, genere, anno, durata, descrizione) {
    const newFilmId = Date.now();
    const newFilm = {
        id: newFilmId, 
        locandina: locandina,
        titolo: titolo,
        genere: genere,
        anno: anno,
        durata: durata,
        descrizione: descrizione
    };
    savedFilms.set(newFilmId, newFilm);
    console.log(`Film aggiunto: "${titolo}"`);
    showMyListsSection();
}

// Funzione che gestisce l'input e chiama la funzione di aggiunta
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
        
        // Pulisce tutti i campi dopo l'aggiunta
        titoloInput.value = "";
        genereInput.value = "";
        annoInput.value = "";
        durataInput.value = "";
        descrizioneInput.value = "";
    } else {
        alert("Inserisci almeno il titolo del film!");
    }
>>>>>>> 025477673307c2b4a3f607c2f85fc2ec4fe10325
}