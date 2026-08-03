
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
        //se la query Ã¨ vuota allora scrivi nessun artista
         rowArtist.innerHTML=""
         rowArtist.innerHTML="Nessun Artista"
         
    } else {
        //se la query ha valore esegui la ricerca
        searchAPIArtists(query)
    }
})

// -------- js mostra tutto --------
const container = document.getElementById("songsGrid")
const svgNS = "http://www.w3.org/2000/svg"

// funzione per creare le card
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

  const imageWrapper = document.createElement("div")
  imageWrapper.classList.add("imageWrapper")

  const image = document.createElement("img")
  image.src = cover_medium
  image.alt = title
  image.classList.add("img-fluid", "rounded", "mb-2")

  const playButton = document.createElement("button")
  playButton.classList.add("playButton")

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

  card.append(imageWrapper, songTitle, artistName)
  col.appendChild(card)

  return col
}

// recupero le canzoni salvate dalla Home
const songs = JSON.parse(sessionStorage.getItem("trendingSongs")) || []

songs.forEach((song) => {
  container.appendChild(cardTrendingSongs(song))
})


