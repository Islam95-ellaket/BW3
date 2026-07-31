// -------- elementi DOM --------
const rowArtist = document.getElementById('rowArtist')
const artistWrapper = document.getElementById('artistWrapper')
const leftArrow = document.getElementById('leftArrow')
const rightArrow = document.getElementById('rightArrow')


// -------- Artisti popolari + carosello --------
const API_URL = `https://striveschool-api.herokuapp.com/api/deezer/search?q=artist`

const getArtist = async () => {
    try {
        const result = await fetch(API_URL)
        const data = await result.json()

        // Mappa per filtrare gli artisti duplicati tramite ID
        const uniqueArtists = new Map()
        
        data.data.forEach(({ artist }) => {
            if (artist && !uniqueArtists.has(artist.id)) {
                uniqueArtists.set(artist.id, artist)
            }
        })

        uniqueArtists.forEach((artist) => {
            rowArtist.append(createCardArtist(artist))
        })

        const spacer = document.createElement('div')
        spacer.className = 'artistSpacer'
        rowArtist.appendChild(spacer)

        updateArrows()
    } catch (error) {
        console.error(error)
    }
}
getArtist()

const createCardArtist = ({ id, name, picture_medium, type }) => {
    const cardArtist = document.createElement('div')
    // RIMOSSO 'bg-transparent' perché bloccava l'hover CSS con l'!important di Bootstrap
    cardArtist.classList.add('card', 'px-2') 
    cardArtist.dataset.artistId = id

    // Wrapper immagine
    const cardImageWrapper = document.createElement('div')
    cardImageWrapper.classList.add('cardImageWrapper')

    const cardArtistImage = document.createElement('img')
    cardArtistImage.classList.add('card-img-top', 'img-fluid', 'rounded-circle')
    cardArtistImage.src = picture_medium
    cardArtistImage.alt = name

    const playBtn = document.createElement('button')
    playBtn.classList.add('cardPlayBtn')
    playBtn.setAttribute('aria-label', `Riproduci ${name}`)
    playBtn.innerHTML = `<i class="bi bi-play-fill"></i>`

    cardImageWrapper.append(cardArtistImage, playBtn)

    const cardNameArtist = document.createElement('p')
    cardNameArtist.classList.add('card-title', 'text-white', 'my-0', 'small', 'fw-semibold', 'mt-2')
    cardNameArtist.innerText = name

    const cardText = document.createElement('p')
    cardText.classList.add('card-text', 'text-secondary', 'small', 'mb-0')
    cardText.innerText = type

    cardArtist.append(cardImageWrapper, cardNameArtist, cardText)

    return cardArtist
}

// -------- logica del carosello --------

// Distanza per scorrere esattamente 3 card (175px * 3 + 16px gap * 3)
const SCROLL_DISTANCE = (175 + 16) * 3 

rightArrow.addEventListener("click", () => {
    artistWrapper.scrollBy({ left: SCROLL_DISTANCE, behavior: "smooth" })
})

leftArrow.addEventListener("click", () => {
    artistWrapper.scrollBy({ left: -SCROLL_DISTANCE, behavior: "smooth" })
})

// Gestione visibilità frecce
const updateArrows = () => {
    const isAtStart = artistWrapper.scrollLeft <= 0
    const isAtEnd = artistWrapper.scrollLeft + artistWrapper.clientWidth >= artistWrapper.scrollWidth - 5

    leftArrow.style.visibility = isAtStart ? "hidden" : "visible"
    rightArrow.style.visibility = isAtEnd ? "hidden" : "visible"
}

artistWrapper.addEventListener("scroll", updateArrows)
window.addEventListener("resize", updateArrows)