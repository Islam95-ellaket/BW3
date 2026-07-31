
const rowArtist = document.getElementById('rowArtist')

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
    const cardArtist = document.createElement('div')
    cardArtist.classList.add('card', 'bg-transparent', 'px-1')
    cardArtist.dataset.artistId = id

    const cardArtistImage = document.createElement('img')
    cardArtistImage.classList.add('card-img-top', 'img-fluid', 'rounded-circle')
    cardArtistImage.src = picture_medium
    cardArtistImage.alt = name

    const cardNameArtist = document.createElement('p')
    cardNameArtist.classList.add('text-white', 'my-0', 'small', 'fw-semibold')
    cardNameArtist.innerText = name

    const cardText = document.createElement('p')
    cardText.classList.add('card-text', 'text-secondary', 'small')
    cardText.innerText = type

    cardArtist.append(cardArtistImage, cardNameArtist, cardText)

    return cardArtist
}

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
    // pulisco la ricerca
    const value = searchInput.value.toLowerCase().trim()
    // filtro l'array
    const filteredArtists = database.data.filter(item =>
        item.artist.name.toLowerCase().includes(value)
    );
    // pulisco la row
    rowArtist.innerHTML = ''
    // filtro i nuovi risultati
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
        rowArtist.innerHTML=""
        rowArtist.append(createCardArtist(data.data[0].artist))

    } catch (error) {
        console.log(error)
        rowArtist.innerHTML=""
        rowArtist.innerHTML="Nessun Artista"
    }
}


//ricerca a ogni input
searchInput.addEventListener('submit', (e)=>{
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
         rowArtist.innerHTML=""
         rowArtist.innerHTML="Nessun Artista"
         
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
  updateArrows()
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
const updateArrows = () => {
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

trendingWrapper.addEventListener("scroll", updateArrows)
window.addEventListener("resize", updateArrows)

rightArrow.addEventListener("click", () =>
  // Scorro il carosello verso destra di 600px con un'animazione fluida
  trendingWrapper.scrollBy({ left: 600, behavior: "smooth" }),
)

leftArrow.addEventListener("click", () =>
  // Scorro il carosello verso sinistra di 600px con un'animazione fluida
  trendingWrapper.scrollBy({ left: -600, behavior: "smooth" }),
)


