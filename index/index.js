const rowArtist = document.getElementById('rowArtist')
const artistWrapper = document.getElementById('artistWrapper')
const leftArrowArtist = document.getElementById('leftArrowArtist')
const rightArrowArtist = document.getElementById('rightArrowArtist')

const API_URL = `https://striveschool-api.herokuapp.com/api/deezer/search?q=`

const searchInput = document.getElementById('searchInput')
const searchForm = document.getElementById('searchForm')
let databaseArtist = []
const songTitle = document.getElementById('songTitle')

// funzione chiamta API artisti
const getArtist = async () => {
    try {
        const result = await fetch(`${API_URL}artist`)
        const data = await result.json()

        databaseArtist = data
        databaseArtist.data.forEach(({ artist }) => {
            rowArtist.append(createCardArtist(artist));
        });
    } catch (error) {
        console.log(error)
    }
}

// creo la crd degli atristi
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

// --------js brani di tendenza e radio--------

const trendingSection = document.querySelector(".trendingSection")
const trendingContainer = trendingSection.querySelector(".cardsContainer")
const radioSection = document.querySelector(".radioSection")
const radioContainer = radioSection.querySelector(".cardsContainer")
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

const radioArtists = [
    "Dance",
    "Rock",
    "Pop",
    "Jazz",
    "Hip Hop",
    "Electronic",
    "Chill",
    "House",
]

// fetch canzoni casuali per gli artisti selezionati
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

// fetch sezione radio, prendo 3 canzoni per ogni genere e le mostro in un massimo di 20 card
const getPopularRadios = async () => {
    try {
        const requests = radioArtists.map((genre) =>
            fetch(
                `https://striveschool-api.herokuapp.com/api/deezer/search?q=${genre}`,
            ).then((res) => res.json()),
        )

        const results = await Promise.all(requests)

        const radios = results
            .flatMap((result) => result.data.slice(0, 3))
            .slice(0, 20)

        renderCards(radios, radioContainer, createSongCard, "carouselSpacer")

    } catch (e) {
        console.error(e)
    }
}

// scelgo 6 artisti casuali ad ogni caricamento
const getRandomArtists = (artists, number) => {
    return [...artists].sort(() => Math.random() - 0.5).slice(0, number)
}

// canzoni di tendenza, scelgo 6 artisti casuali e prendo le prime 20 canzoni
const getArtistTrending = async () => {
    const randomArtists = getRandomArtists(artists, 6)

    const songs = await getRandomSongs(randomArtists)

    const trendingSongs = songs.slice(0, 20)

    sessionStorage.setItem("trendingSongs", JSON.stringify(trendingSongs))

    renderCards(
        trendingSongs,
        trendingContainer,
        createSongCard,
        "carouselSpacer",
    )
}

// funzione per renderizzare le card, con possibilità di aggiungere uno spacer alla fine
const renderCards = (data, container, createCard, spacerClass) => {
    container.innerHTML = ""

    data.forEach((item) => {
        container.appendChild(createCard(item))
    })

    if (spacerClass) {
        const spacer = document.createElement("div")
        spacer.className = spacerClass
        container.appendChild(spacer)
    }
}

// funzione per inizializzare il carosello con frecce di scorrimento
const initCarousel = (carousel) => {
    const wrapper = carousel.querySelector(".carouselContent")
    const leftArrow = carousel.querySelector(".left")
    const rightArrow = carousel.querySelector(".right")

    const updateArrows = () => {
        leftArrow.style.visibility = wrapper.scrollLeft <= 0 ? "hidden" : "visible"

        rightArrow.style.visibility =
            wrapper.scrollLeft >= wrapper.scrollWidth - wrapper.clientWidth - 1
                ? "hidden"
                : "visible"
    }

    leftArrow.addEventListener("click", () => {
        wrapper.scrollBy({
            left: -600,
            behavior: "smooth",
        })
    })

    rightArrow.addEventListener("click", () => {
        wrapper.scrollBy({
            left: 600,
            behavior: "smooth",
        })
    })

    wrapper.addEventListener("scroll", updateArrows)
    window.addEventListener("resize", updateArrows)

    updateArrows()
}

// funzione per creare le card destrutturando l'array
const createSongCard = ({
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

// inizializzo le funzioni per il caricamento delle canzoni di tendenza e delle radio
const init = async () => {
    await getArtistTrending()

    await getPopularRadios()

    document.querySelectorAll(".carouselWrapper").forEach(initCarousel)
}

init()



// -------------------- ALBUM ---------------------------
const artistsAlbum = ["Taylor Swift", "Billie Eilish", "Bad Bunny", "Sabrina Carpenter", "coldplay", "Chappell Roan", "Ariana Grande", "Post Malone"]
const albumsContainer = document.getElementById('albumsContainer')
const swiperContainers = document.querySelectorAll("#albumsSwiperContainer")

let databaseAlbums = []

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



// ------------------- RICERCA -------------------------------- //

const searchArtists = async () => {
    const value = searchInput?.value.trim() ?? ""

    if (!value) {
        if (songTitle) {
            songTitle.textContent = "Brani di tendenza"
        }
        getInitialData()
        return
    }

    try {
        const response = await fetch(`${API_URL}${encodeURIComponent(value)}`)
        const data = await response.json()
        const results = Array.isArray(data?.data) ? data.data : []

        rowArtist.innerHTML = ""

        if (!results.length) {
            rowArtist.textContent = "Nessun artista"
            return
        }

        const uniqueArtists = new Map()

        results.forEach(({ artist }) => {
            if (!artist || !artist.name) return

            const artistName = artist.name.toLowerCase()
            const query = value.toLowerCase()

            if (artistName.includes(query) && !uniqueArtists.has(artist.id)) {
                uniqueArtists.set(artist.id, artist)
            }
        })

        if (uniqueArtists.size === 0) {
            rowArtist.textContent = "Nessun artista"
            return
        }

        if (songTitle) {
            songTitle.textContent = `Risultati per "${value}"`
        }

        uniqueArtists.forEach((artist) => {
            rowArtist.append(createCardArtist(artist))
        })
    } catch (error) {
        console.error(error)
        rowArtist.textContent = "Nessun artista"
    }
}

searchInput?.addEventListener("input", () => {
    const query = searchInput.value.trim()
    if (query === "") {
        getInitialData()
        return
    }

    searchArtists()
})

searchForm?.addEventListener("submit", (event) => {
    event.preventDefault()
    searchArtists()
})

const getInitialData = async () => {
    if (rowArtist) rowArtist.innerHTML = ""
    if (albumsContainer) albumsContainer.innerHTML = ""
    if (trendingContainer) trendingContainer.innerHTML = ""

    await getArtist()
    await getAlbums()
    await getArtistTrending()

    if (songTitle) {
        songTitle.textContent = "Brani di tendenza"
    }
}

getInitialData()

