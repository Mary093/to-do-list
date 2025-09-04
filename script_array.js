const films = [
    {
      "id": 1,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg",
      "titolo": "Il Padrino",
      "genere": "Drammatico, Crime",
      "anno": 1972,
      "durata": "175 min",
      "descrizione": "La saga della famiglia mafiosa dei Corleone, guidata dal patriarca Don Vito."
    },
    {
      "id": 2,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg",
      "titolo": "Forrest Gump",
      "genere": "Drammatico, Commedia",
      "anno": 1994,
      "durata": "142 min",
      "descrizione": "La vita straordinaria di Forrest, un uomo semplice che attraversa decenni di storia americana."
    },
    {
      "id": 3,
      "locandina": "https://pad.mymovies.it/filmclub/2009/03/027/locandinapg3.jpg",
      "titolo": "Inception",
      "genere": "Fantascienza, Thriller",
      "anno": 2010,
      "durata": "148 min",
      "descrizione": "Un ladro esperto nel furto di segreti attraverso i sogni deve compiere l'impossibile: impiantare un'idea."
    },
    {
      "id": 4,
      "locandina": "https://pad.mymovies.it/filmclub/2014/01/001/locandina.jpg",
      "titolo": "Interstellar",
      "genere": "Fantascienza, Drammatico",
      "anno": 2014,
      "durata": "169 min",
      "descrizione": "Un gruppo di astronauti viaggia attraverso un wormhole alla ricerca di un nuovo pianeta abitabile."
    },
    {
      "id": 5,
      "locandina": "https://pad.mymovies.it/filmclub/2007/02/131/locandina.jpg",
      "titolo": "Il Cavaliere Oscuro",
      "genere": "Azione, Crime, Drammatico",
      "anno": 2008,
      "durata": "152 min",
      "descrizione": "Batman affronta il Joker, un criminale psicopatico che semina il caos a Gotham City."
    },
    {
      "id": 6,
      "locandina": "https://pad.mymovies.it/filmclub/2006/02/315/locandina.jpg",
      "titolo": "Schindler's List",
      "genere": "Storico, Drammatico",
      "anno": 1993,
      "durata": "195 min",
      "descrizione": "La storia vera di Oskar Schindler, che salvò centinaia di ebrei durante l'Olocausto."
    },
    {
      "id": 7,
      "locandina": "https://pad.mymovies.it/filmclub/2018/12/029/locandina.jpg",
      "titolo": "Avengers: Endgame",
      "genere": "Azione, Fantascienza",
      "anno": 2019,
      "durata": "181 min",
      "descrizione": "I supereroi Marvel si uniscono per affrontare Thanos in una battaglia epica per il destino dell'universo."
    },
    {
      "id": 8,
      "locandina": "https://pad.mymovies.it/filmclub/2004/06/506/locandinapg1.jpg",
      "titolo": "Titanic",
      "genere": "Romantico, Drammatico",
      "anno": 1997,
      "durata": "195 min",
      "descrizione": "Una storia d'amore tragica a bordo del famoso transatlantico affondato nel 1912."
    },
    {
      "id": 9,
      "locandina": "https://pad.mymovies.it/filmclub/2002/08/151/locandina.jpg",
      "titolo": "Le Ali della Libertà",
      "genere": "Drammatico",
      "anno": 1994,
      "durata": "142 min",
      "descrizione": "Un uomo ingiustamente condannato trova speranza e amicizia in prigione."
    },
    {
      "id": 10,
      "locandina": "https://pad.mymovies.it/filmclub/2001/11/012/locandina.jpg",
      "titolo": "Fight Club",
      "genere": "Drammatico, Thriller",
      "anno": 1999,
      "durata": "139 min",
      "descrizione": "Un impiegato insoddisfatto crea un club segreto di combattimento con un carismatico sconosciuto."
    },
    {
      "id": 11,
      "locandina": "https://pad.mymovies.it/filmclub/2006/08/102/locandinapg2.jpg",
      "titolo": "Pulp Fiction",
      "genere": "Crime, Commedia nera",
      "anno": 1994,
      "durata": "154 min",
      "descrizione": "Storie intrecciate di criminali, pugili e gangster in una narrazione non lineare firmata Tarantino."
    },
    {
      "id": 12,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/5/5f/Gladiator_%282000_film%29_poster.jpg",
      "titolo": "Il Gladiatore",
      "genere": "Storico, Azione",
      "anno": 2000,
      "durata": "155 min",
      "descrizione": "Un generale romano tradito diventa gladiatore per vendicare la sua famiglia e l'imperatore."
    },
    {
      "id": 13,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/6/6c/Matrix_DVD_cover.jpg",
      "titolo": "Matrix",
      "genere": "Fantascienza, Azione",
      "anno": 1999,
      "durata": "136 min",
      "descrizione": "Un hacker scopre che la realtà è una simulazione e si unisce alla resistenza contro le macchine."
    },
    {
      "id": 14,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/7/7e/La_La_Land_%28film%29.png",
      "titolo": "La La Land",
      "genere": "Musical, Romantico",
      "anno": 2016,
      "durata": "128 min",
      "descrizione": "Un'aspirante attrice e un musicista jazz si innamorano mentre inseguono i loro sogni a Los Angeles."
    },
    {
      "id": 15,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/0/08/Parasite_%282019_film%29.png",
      "titolo": "Parasite",
      "genere": "Thriller, Drammatico",
      "anno": 2019,
      "durata": "132 min",
      "descrizione": "Una famiglia povera si infiltra nella vita di una famiglia ricca, con conseguenze imprevedibili."
    },
    {
      "id": 16,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/0/0d/Jurassic_Park_%28film%29.png",
      "titolo": "Jurassic Park",
      "genere": "Fantascienza, Avventura",
      "anno": 1993,
      "durata": "127 min",
      "descrizione": "Un parco tematico con dinosauri clonati diventa un incubo quando le creature si liberano."
    },
    {
      "id": 17,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/2/2d/Good_Will_Hunting.png",
      "titolo": "Will Hunting – Genio Ribelle",
      "genere": "Drammatico",
      "anno": 1997,
      "durata": "126 min",
      "descrizione": "Un giovane genio matematico lotta con i suoi demoni interiori e trova guida in uno psicologo."
    },
    {
      "id": 18,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/3/3b/Amelie_poster.jpg",
      "titolo": "Il favoloso mondo di Amélie",
      "genere": "Commedia, Romantico",
      "anno": 2001,
      "durata": "122 min",
      "descrizione": "Una giovane donna parigina decide di migliorare la vita degli altri in modi creativi e segreti."
    },
    {
      "id": 19,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/0/0e/Up_%282009_film%29.jpg",
      "titolo": "Up",
      "genere": "Animazione, Avventura",
      "anno": 2009,
      "durata": "96 min",
      "descrizione": "Un anziano vedovo parte per un viaggio in Sud America con una casa volante e un giovane esploratore."
    },
    {
      "id": 20,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/9/9b/The_Social_Network_film_poster.png",
      "titolo": "The Social Network",
      "genere": "Biografico, Drammatico",
      "anno": 2010,
      "durata": "120 min",
      "descrizione": "La storia della nascita di Facebook e delle controversie legali che ne seguirono."
    },
    {
      "id": 21,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/7/7e/The_Silence_of_the_Lambs_poster.jpg",
      "titolo": "Il Silenzio degli Innocenti",
      "genere": "Thriller, Crime",
      "anno": 1991,
      "durata": "118 min",
      "descrizione": "Una giovane agente dell'FBI cerca l'aiuto di un brillante ma inquietante serial killer per catturare un altro assassino."
    },
    {
      "id": 22,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/3/3e/Dead_Poets_Society.jpg",
      "titolo": "L'attimo fuggente",
      "genere": "Drammatico",
      "anno": 1989,
      "durata": "128 min",
      "descrizione": "Un insegnante anticonformista ispira i suoi studenti a pensare con la propria testa."
    },
    {
      "id": 23,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/1/1e/Green_Book_%282018_film%29.png",
      "titolo": "Green Book",
      "genere": "Biografico, Drammatico",
      "anno": 2018,
      "durata": "130 min",
      "descrizione": "Un autista italoamericano accompagna un pianista afroamericano in un tour nel sud segregato degli USA."
    },
    {
      "id": 24,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/2/2d/Coco_%282017_film%29.png",
      "titolo": "Coco",
      "genere": "Animazione, Avventura",
      "anno": 2017,
      "durata": "105 min",
      "descrizione": "Un giovane musicista messicano visita il mondo dei morti per scoprire la verità sulla sua famiglia."
    },
    {
      "id": 25,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/1/1b/The_Revenant_2015_film_poster.jpg",
      "titolo": "Revenant – Redivivo",
      "genere": "Avventura, Drammatico",
      "anno": 2015,
      "durata": "156 min",
      "descrizione": "Un esploratore ferito cerca vendetta contro chi lo ha abbandonato in una terra selvaggia."
    },
    {
      "id": 26,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/2/2e/Bohemian_Rhapsody_poster.png",
      "titolo": "Bohemian Rhapsody",
      "genere": "Biografico, Musicale",
      "anno": 2018,
      "durata": "134 min",
      "descrizione": "La storia di Freddie Mercury e della leggendaria band Queen."
    },
    {
      "id": 27,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/7/7e/The_Grand_Budapest_Hotel_Poster.jpg",
      "titolo": "Grand Budapest Hotel",
      "genere": "Commedia, Drammatico",
      "anno": 2014,
      "durata": "99 min",
      "descrizione": "Le avventure di un concierge e del suo giovane protetto in un hotel di lusso europeo."
    },
    {
      "id": 28,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/5/5e/The_Pianist_movie.jpg",
      "titolo": "Il Pianista",
      "genere": "Biografico, Drammatico",
      "anno": 2002,
      "durata": "150 min",
      "descrizione": "La storia vera di un pianista ebreo che sopravvive alla distruzione del ghetto di Varsavia."
    },
    {
      "id": 29,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/3/3d/Her2013Poster.jpg",
      "titolo": "Her",
      "genere": "Fantascienza, Romantico",
      "anno": 2013,
      "durata": "126 min",
      "descrizione": "Un uomo solitario si innamora di un sistema operativo dotato di intelligenza artificiale."
    },
    {
      "id": 30,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/6/6e/The_Imitation_Game_poster.jpg",
      "titolo": "The Imitation Game",
      "genere": "Biografico, Storico",
      "anno": 2014,
      "durata": "113 min",
      "descrizione": "Alan Turing decifra il codice Enigma durante la Seconda Guerra Mondiale."
    },
    {
      "id": 31,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/2/2f/Black_Panther_%28film%29_poster.jpg",
      "titolo": "Black Panther",
      "genere": "Azione, Fantascienza",
      "anno": 2018,
      "durata": "134 min",
      "descrizione": "Il principe T'Challa torna nel regno di Wakanda per diventare re e proteggere il suo popolo."
    },
    {
      "id": 32,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/8/8a/The_Lion_King_poster.jpg",
      "titolo": "Il Re Leone",
      "genere": "Animazione, Avventura",
      "anno": 1994,
      "durata": "88 min",
      "descrizione": "Il giovane leone Simba deve affrontare il suo destino e reclamare il trono."
    },
    {
      "id": 33,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/2/2c/Whiplash_poster.jpg",
      "titolo": "Whiplash",
      "genere": "Drammatico, Musicale",
      "anno": 2014,
      "durata": "107 min",
      "descrizione": "Un giovane batterista affronta un insegnante spietato per diventare il migliore."
    },
    {
      "id": 34,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/3/3f/Arrival_%282016_film%29.jpg",
      "titolo": "Arrival",
      "genere": "Fantascienza, Drammatico",
      "anno": 2016,
      "durata": "116 min",
      "descrizione": "Una linguista cerca di comunicare con misteriosi alieni arrivati sulla Terra."
    },
    {
      "id": 35,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/1/1f/Blade_Runner_2049.png",
      "titolo": "Blade Runner 2049",
      "genere": "Fantascienza, Thriller",
      "anno": 2017,
      "durata": "164 min",
      "descrizione": "Un replicante scopre un segreto che potrebbe cambiare il futuro dell'umanità."
    },
    {
      "id": 36,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/4/4f/The_Wolf_of_Wall_Street_2013.png",
      "titolo": "The Wolf of Wall Street",
      "genere": "Biografico, Commedia",
      "anno": 2013,
      "durata": "180 min",
      "descrizione": "La scalata e la caduta di Jordan Belfort, broker di Wall Street."
    },
    {
      "id": 37,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/0/0d/Mad_Max_Fury_Road.jpg",
      "titolo": "Mad Max: Fury Road",
      "genere": "Azione, Fantascienza",
      "anno": 2015,
      "durata": "120 min",
      "descrizione": "In un mondo post-apocalittico, Max e Furiosa lottano per la libertà."
    },
    {
      "id": 38,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/6/6f/Inside_Out_%282015_film%29_poster.jpg",
      "titolo": "Inside Out",
      "genere": "Animazione, Commedia",
      "anno": 2015,
      "durata": "95 min",
      "descrizione": "Le emozioni di una bambina prendono vita mentre affronta un grande cambiamento."
    },
    {
      "id": 39,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/7/7a/Slumdog_Millionaire_poster.jpg",
      "titolo": "The Millionaire (Slumdog Millionaire)",
      "genere": "Drammatico, Romantico",
      "anno": 2008,
      "durata": "120 min",
      "descrizione": "Un ragazzo delle baraccopoli di Mumbai partecipa a 'Chi vuol essere milionario?' e rivive la sua incredibile storia."
    },
    {
      "id": 40,
      "locandina": "https://upload.wikimedia.org/wikipedia/en/2/2c/Cast_Away_movie.jpg",
      "titolo": "Cast Away",
      "genere": "Avventura, Drammatico",
      "anno": 2000,
      "durata": "143 min",
      "descrizione": "Un uomo sopravvive a un incidente aereo e lotta per la sopravvivenza su un'isola deserta, trovando compagnia in un pallone da volley."
    }
  ];

  let savedFilms = [];

  // Inizializzazione
  document.addEventListener('DOMContentLoaded', function() {
      showExploreSection();
      setupNavigation();
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
  
  // Funzione per aggiornare la classe attiva sui link di navigazione
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
      
      renderFilms(films, document.getElementById('exploreList'), true);
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
          savedCountSpan.textContent = savedFilms.length;
      }
      
      renderFilms(savedFilms, document.getElementById('savedList'), false);
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
  
      const actionButton = card.querySelector('.btn');
      const actionSpanText = card.querySelector('.btn span:last-child');
      const actionSpanIcon = card.querySelector('.btn span:first-child');
      
      if (showToggle) {
          const isSaved = savedFilms.some(saved => saved.id === film.id);
          actionButton.classList.add(isSaved ? 'btn-success' : 'btn-primary');
          actionSpanIcon.textContent = isSaved ? 'bookmark' : 'bookmark_border';
          actionSpanText.textContent = isSaved ? 'Rimuovi' : 'Aggiungi';
          actionButton.onclick = () => toggleSavedFilm(film.id);
      } else {
          actionButton.classList.add('btn-danger');
          actionSpanIcon.textContent = 'delete';
          actionSpanText.textContent = 'Rimuovi';
          actionButton.onclick = () => removeSavedFilm(film.id);
      }
      
      return card;
  }
  
  // Funzione generica per renderizzare una lista di film
  function renderFilms(filmList, container, showToggle) {
      container.innerHTML = '';
      
      if (filmList.length === 0) {
          container.innerHTML = `
              <div class="alert alert-info">
                  <h5>Nessun film da mostrare</h5>
                  <p>${showToggle ? 'Nessun film disponibile da esplorare.' : 'Vai nella sezione "Esplora" per aggiungere film alla tua lista!'}</p>
              </div>
          `;
          return;
      }
  
      filmList.forEach(film => {
          const filmElement = createFilmElement(film, showToggle);
          container.appendChild(filmElement);
      });
  }
  
  // Funzione per aggiungere/rimuovere film dalla lista salvata
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
  
  // Funzione per rimuovere film dalla lista salvata
  function removeSavedFilm(filmId) {
      savedFilms = savedFilms.filter(saved => saved.id !== filmId);
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
      const searchTerm = searchInput.value.toLowerCase().trim();
      const resultsContainer = document.getElementById("searchResults");
      
      if (!searchTerm) {
          resultsContainer.innerHTML = "";
          return;
      }
      
      const filteredFilms = films.filter(film => 
          film.titolo.toLowerCase().includes(searchTerm) ||
          film.genere.toLowerCase().includes(searchTerm) ||
          film.descrizione.toLowerCase().includes(searchTerm)
      );
      
      if (filteredFilms.length > 0) {
          const titleElement = document.createElement('h4');
          titleElement.className = 'text-dark';
          titleElement.textContent = `🔍 Risultati della ricerca (${filteredFilms.length})`;
          
          resultsContainer.innerHTML = '';
          resultsContainer.appendChild(titleElement);
  
          renderFilms(filteredFilms, resultsContainer, true);
  
      } else {
          resultsContainer.innerHTML = `
              <div class="col-12">
                  <div class="alert alert-warning">
                      <h5>Nessun risultato trovato</h5>
                      <p>Prova con termini di ricerca diversi.</p>
                  </div>
              </div>
          `;
      }
  }
  
  // Funzione per aggiungere un nuovo film personalizzato
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
  }