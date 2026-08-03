const rowArtist = document.getElementById('rowArtist')
const artistWrapper = document.getElementById('artistWrapper')
const leftArrowArtist = document.getElementById('leftArrowArtist')
const rightArrowArtist = document.getElementById('rightArrowArtist')


const API_URL = `https://striveschool-api.herokuapp.com/api/deezer/search?q=`


const searchInput = document.getElementById('searchInput')
const searchForm = document.getElementById('searchForm')
let database = []

const getArtist = async () => {
    try {
        const result = await fetch(`${API_URL}artist`)
        const data = await result.json()
        console.log(data)

        database = data
        database.data.forEach(({ artist }) => {
            rowArtist.append(createCardArtist(artist));
        });
    } catch (error) {
        console.log(error)
    }
}

getArtist()


const createCardArtist = ({ id, name, picture_medium, type }) => {
    const cardArtist = document.createElement('div');
    cardArtist.classList.add('card', 'px-1');
    cardArtist.dataset.artistId = id;

    // Contenitore immagine
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('cardImageWrapper');

    // Immagine
    const cardArtistImage = document.createElement('img');
    cardArtistImage.classList.add('card-img-top', 'img-fluid', 'rounded-circle');
    cardArtistImage.src = picture_medium;
    cardArtistImage.alt = name;

    // Bottone Play
    const playBtn = document.createElement('button');
    playBtn.classList.add('play-btn');
    playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';

    // Inserisco immagine e bottone nel wrapper
    imageWrapper.append(cardArtistImage, playBtn);

    const cardNameArtist = document.createElement('p');
    cardNameArtist.classList.add('text-white', 'my-0', 'small', 'fw-semibold');
    cardNameArtist.innerText = name;

    const cardText = document.createElement('p');
    cardText.classList.add('card-text', 'text-secondary', 'small');
    cardText.innerText = type;

    // Inserisco tutto nella card
    cardArtist.append(imageWrapper, cardNameArtist, cardText);

    return cardArtist;
}

// Logica del carosello (Scorrimento 3 card artisti alla volta)
const SCROLL_DISTANCE = (175 + 16) * 3 // 3 card per volta

const updateArtistArrows = () => {
    const isAtStart = artistWrapper.scrollLeft <= 0
    const isAtEnd =
        artistWrapper.scrollLeft + artistWrapper.clientWidth >=
        artistWrapper.scrollWidth - 5

    leftArrowArtist.style.visibility = isAtStart ? "hidden" : "visible"
    rightArrowArtist.style.visibility = isAtEnd ? "hidden" : "visible"
}

artistWrapper.addEventListener("scroll", updateArtistArrows)
window.addEventListener("resize", updateArtistArrows)

rightArrowArtist.addEventListener("click", () =>
    artistWrapper.scrollBy({ left: SCROLL_DISTANCE, behavior: "smooth" })
)

leftArrowArtist.addEventListener("click", () =>
    artistWrapper.scrollBy({ left: -SCROLL_DISTANCE, behavior: "smooth" })
)

// -------- js modale --------

document.addEventListener('DOMContentLoaded', () => {

    const signupBanner = document.getElementById('signupBanner')
    const closeBannerBtn = document.getElementById('closeBannerBtn')
    const openModalBtn = document.getElementById('openModalBtn')
    const signupModal = document.getElementById('signupModal')
    const closeModalBtn = document.getElementById('closeModalBtn')
    const registerForm = document.getElementById('registerForm')

    // si chiud banner quando si clicca sulla 'X'
    closeBannerBtn.addEventListener('click', () => {
        signupBanner.classList.add('hidden')
    });

    // si apre la modale quando si clicca su 'Iscriviti gratis'
    openModalBtn.addEventListener('click', () => {
        signupModal.classList.add('active')
        document.body.style.overflow = 'hidden' // Blocco dello scroll di sfondo
    })

    //  chiudela modal quando si clicca sulla 'X'
    const closeModal = () => {
        signupModal.classList.remove('active')
        document.body.style.overflow = ''
    };

    closeModalBtn.addEventListener('click', closeModal)

    // chiude la modal cliccando sull'overlay scuro esterno
    signupModal.addEventListener('click', (e) => {
        if (e.target === signupModal) {
            closeModal();
        }
    })

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value

        alert(`Registrazione completata per ${username} (${email})! Benvenuto su Spotify Clone.`)

        // acnhe se fittizio chiude la modale e nasconde il banner dopo la registrazione
        closeModal()
        signupBanner.classList.add('hidden')
    })
})



const searchArtists = () => {
    const value = searchInput.value.toLowerCase().trim()

    if (!database || !Array.isArray(database.data) || database.data.length === 0) {
        return
    }

    const filteredArtists = database.data.filter(item =>
        item.artist.name.toLowerCase().includes(value)
    );

    rowArtist.innerHTML = ''

    if (filteredArtists.length === 0) {
        rowArtist.innerHTML = 'Nessun Artista'
        return
    }

    filteredArtists.forEach(({ artist }) => {
        rowArtist.append(createCardArtist(artist))
    })
}

// fa nuovo API per singolo artista
const searchAPIArtists = async (query) => {
    try {
        const result = await fetch(`${API_URL}${query}`)
        const data = await result.json()
        console.log(data)

        if (!data || !Array.isArray(data.data) || data.data.length === 0) {
            rowArtist.innerHTML = 'Nessun Artista'
            return
        }

        rowArtist.innerHTML = ''
        rowArtist.append(createCardArtist(data.data[0].artist))

    } catch (error) {
        console.log(error)
        rowArtist.innerHTML = 'Nessun Artista'
    }
}


//ricerca a ogni input
searchInput.addEventListener('input', (e)=>{
    e.preventDefault()
    searchArtists()
}
)

//ricerca all'invio
searchForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    //salvo il valore della ricerca
    const query = searchInput.value.toLowerCase().trim()
    console.log(query)
    // controllo la ricerca
    if (query === '') {
        //se la query è vuota allora scrivi nessun artista
         rowArtist.innerHTML = 'Nessun Artista'
    } else {
        //se la query ha valore esegui la ricerca
        searchAPIArtists(query)
    }
})

// -------- js brani di tendenza --------

const container = document.getElementById("trendingSongsContainer")
const trendingWrapper = document.getElementById("trendingWrapper")
const leftArrow = document.getElementById("leftArrow")
const rightArrow = document.getElementById("rightArrow")
const svgNS = "http://www.w3.org/2000/svg"
const artists = [
  "The Weeknd",
  "Dua Lipa",
  "Taylor Swift",
  "Madonna",
  "Planet Funk",
  "Coldplay",
  "Imagine Dragons",
  "Lady Gaga",
  "Bruno Mars",
  "Rihanna",
  "David Guetta",
]

const getRandomSongs = async (artists) => {
  try {
    const requests = artists.map((artist) =>
      fetch(
        `https://striveschool-api.herokuapp.com/api/deezer/search?q=${artist}`,
      ).then((response) => response.json()),
    )

    const results = await Promise.all(requests)

    // unisco tutte le canzoni
    const songs = results.flatMap((result) => result.data)

    // elimino eventuali doppioni
    const uniqueSongs = songs.filter(
      (song, index, array) =>
        index === array.findIndex((s) => s.id === song.id),
    )

    // mischio le canzoni
    return uniqueSongs.sort(() => Math.random() - 0.5)
  } catch (e) {
    console.error("Errore durante il recupero delle canzoni:", e)
    return []
  }
}

// scelgo 6 artisti casuali ad ogni caricamento
const getRandomArtists = (artists, number) => {
  return [...artists].sort(() => Math.random() - 0.5).slice(0, number)
}
const getArtistTrending = async () => {
  const randomArtists = getRandomArtists(artists, 6)

  const songs = await getRandomSongs(randomArtists)

  songs.slice(0, 20).forEach((song) => {
    container.appendChild(cardTrendingSongs(song))
  })

  // creo div vuoto per avere il margine a fine carousel
  const spacer = document.createElement("div")
  spacer.className = "trendingSpacer"
  container.appendChild(spacer)

  // Aggiorno lo stato iniziale delle frecce
  updateTrendingArrows()
}

getArtistTrending()

// funzione per creare le card destrutturando l'array
const cardTrendingSongs = ({
  title,
  artist: { name },
  album: { cover_medium },
  id,
}) => {
  const col = document.createElement("div")
  col.classList.add("songCardCol")

  const card = document.createElement("div")
  card.classList.add("songCard")

  // nuovo wrapper per l'immagine + pulsante play
  const imageWrapper = document.createElement("div")
  imageWrapper.classList.add("imageWrapper")

  const image = document.createElement("img")
  image.src = cover_medium
  image.alt = title
  image.classList.add("img-fluid", "rounded", "mb-2")

  const playButton = document.createElement("button")
  playButton.classList.add("playButton")

  // creo un svg con proprietà e il comportamento reali di un elemento SVG
  const svg = document.createElementNS(svgNS, "svg")
  svg.setAttribute("viewBox", "0 0 24 24")
  svg.setAttribute("width", "30")
  svg.setAttribute("height", "30")
  svg.setAttribute("fill", "black")

  const path = document.createElementNS(svgNS, "path")
  path.setAttribute("d", "M8 5v14l11-7z")

  svg.appendChild(path)
  playButton.appendChild(svg)

  imageWrapper.append(image, playButton)

  const songTitle = document.createElement("h3")
  songTitle.textContent = title
  songTitle.classList.add("songTitle", "text-light")

  const artistName = document.createElement("p")
  artistName.textContent = name
  artistName.classList.add("artistName", "text-secondary")

  // aggiungo un event listener al pulsante play per aprire la pagina di dettaglio della canzone
  /*card.addEventListener("click", () => {
    window.location.href = `song-detail.html?id=${id}`
  })*/

  card.append(imageWrapper, songTitle, artistName)
  col.appendChild(card)

  return col
}

// funzione per le frecce del carousel
const updateTrendingArrows = () => {
  // Controllo se il carosello è all'inizio
  const isAtStart = trendingWrapper.scrollLeft <= 0

  // Controllo se il carosello è arrivato alla fine
  const isAtEnd =
    trendingWrapper.scrollLeft + trendingWrapper.clientWidth >=
    trendingWrapper.scrollWidth - 5

  // Mostro o nascondo la freccia sinistra in base alla posizione
  leftArrow.style.visibility = isAtStart ? "hidden" : "visible"
  // Mostro o nascondo la freccia destra in base alla posizione
  rightArrow.style.visibility = isAtEnd ? "hidden" : "visible"
}

trendingWrapper.addEventListener("scroll", updateTrendingArrows)
window.addEventListener("resize", updateTrendingArrows)

rightArrow.addEventListener("click", () =>
  // Scorro il carosello verso destra di 600px con un'animazione fluida
  trendingWrapper.scrollBy({ left: 600, behavior: "smooth" }),
)

leftArrow.addEventListener("click", () =>
  // Scorro il carosello verso sinistra di 600px con un'animazione fluida
  trendingWrapper.scrollBy({ left: -600, behavior: "smooth" }),
)

const artistsAlbum = ["Taylor Swift", "Billie Eilish", "Bad Bunny", "Sabrina Carpenter", "coldplay", "Chappell Roan", "Ariana Grande", "Post Malone"]
const albumsContainer = document.getElementById('albumsContainer')
const swiperContainers = document.querySelectorAll("#albumsSwiperContainer")

// fetch ALBUM
const getAlbums = async () => {
    try {
        const fetchPromises = artists.map(artist =>
            fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${encodeURIComponent(artist)}&limit=1`)
                .then(res => res.json())
        )
        const results = await Promise.all(fetchPromises)
        let allTracks = results.flatMap(result => result.data || [])
        allTracks.sort(() => 0.5 - Math.random())
        displayAlbums(allTracks)
    } catch (e) {
        console.log(e)
    }
}
getAlbums()

//card ALBUM
const createAlbumCards = (album) => {
    const colAlbums = document.createElement('div')
    colAlbums.classList.add('col', 'no-wrap', 'mt-3')
    const cardAlbum = document.createElement('div')
    cardAlbum.classList.add('card', 'cardAlbum')
    const imgAlbum = document.createElement('img')
    imgAlbum.classList.add('card-img-top', 'imgAlbum')
    imgAlbum.src = album.album.cover_medium
    const cardBodyAlbum = document.createElement('div')
    cardBodyAlbum.classList.add('card-body', 'd-flex', 'flex-column')
    cardBodyAlbum.style.paddingLeft = '0'
    const albumTitle = document.createElement('a')
    albumTitle.classList.add('card-title', 'albumTitle')
    albumTitle.innerText = album.album.title
    const albumArtist = document.createElement('a')
    albumArtist.classList.add('card-text', 'albumArtistName')
    albumArtist.innerText = album.artist.name
    const cardPlay = document.createElement('button')
    cardPlay.classList.add('playButton')
    cardPlay.innerHTML = `<i class="bi bi-play-circle-fill"></i>`

    cardBodyAlbum.append(albumTitle, albumArtist)
    cardAlbum.append(imgAlbum, cardPlay, cardBodyAlbum)
    colAlbums.appendChild(cardAlbum)
    return colAlbums
}

const displayAlbums = (albums) => {
    if (!albumsContainer || !Array.isArray(albums)) return;
    albumsContainer.innerHTML = ''

    const addedAlbumIds = new Set()

    const uniqueAlbums = albums.filter(item => {
        const albumId = item?.album?.id
        if (!albumId || addedAlbumIds.has(albumId)) {
            return false;
        }
        addedAlbumIds.add(albumId)
        return true
    })

    const top10Albums = uniqueAlbums.slice(0, 10)

    const albumCards = top10Albums.map(createAlbumCards)
    albumsContainer.append(...albumCards)

    window.dispatchEvent(new Event('resize'))
}

//Swiper ALBUM

const scrollTrack = (track, distance) => {
    track.scrollBy({
        left: distance,
        behavior: 'smooth'
    })
}

const setupRowSliders = (container) => {
    const track = container.querySelector("#albumsContainer")
    const btnLeft = container.querySelector("#btn-left")
    const btnRight = container.querySelector("#btn-right")

    if (!track || !btnLeft || !btnRight) return

    const updateArrowVisibility = () => {
        if (track.scrollLeft <= 5) {
            btnLeft.classList.add('is-hidden')
        } else {
            btnLeft.classList.remove('is-hidden')
        }

        const isAtEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5
        const hasScrollableContent = track.scrollWidth > track.clientWidth

        if (!hasScrollableContent || isAtEnd) {
            btnRight.classList.add('is-hidden')
        } else {
            btnRight.classList.remove('is-hidden')
        }
    }

    updateArrowVisibility()

    track.addEventListener("scroll", updateArrowVisibility)
    window.addEventListener("resize", updateArrowVisibility)

    btnRight.addEventListener("click", () => scrollTrack(track, 500))
    btnLeft.addEventListener("click", () => scrollTrack(track, -500))
}

swiperContainers.forEach(container => setupRowSliders(container))

const form = document.getElementById("bottone-input")
const btncerca = document.getElementById("bottone-cerca")
const search = document.querySelector('.navigation')
const sfondo = document.getElementById('sfondo-accesso')
const menu = document.getElementById('menu')/* bottone */
const iconamenu = document.getElementById('icona-menu')/* svg del menu */
const closemenu = document.getElementById('chiusura-menu')/* svg X chiusura */
let aperto = false

btncerca.addEventListener("click", (event) => {
  event.preventDefault()
  form.classList.toggle("apri")
  search.classList.toggle('chiudi')
})

menu.addEventListener('click', (event) => {
  aperto = !aperto
  sfondo.classList.toggle("apri", aperto)

  if (aperto) {
    closemenu.style.display = 'block'
    iconamenu.style.display = 'none'
  } else {
    iconamenu.style.display = 'block'
    closemenu.style.display = 'none'
  }
})

