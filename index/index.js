const rowArtist = document.getElementById('rowArtist')
const artistWrapper = document.getElementById('artistWrapper')
const leftArrow = document.getElementById('leftArrow')
const rightArrow = document.getElementById('rightArrow')


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

const updateArrows = () => {
    const isAtStart = artistWrapper.scrollLeft <= 0
    const isAtEnd =
        artistWrapper.scrollLeft + artistWrapper.clientWidth >=
        artistWrapper.scrollWidth - 5

    leftArrow.style.visibility = isAtStart ? "hidden" : "visible"
    rightArrow.style.visibility = isAtEnd ? "hidden" : "visible"
}

artistWrapper.addEventListener("scroll", updateArrows)
window.addEventListener("resize", updateArrows)

rightArrow.addEventListener("click", () =>
    artistWrapper.scrollBy({ left: SCROLL_DISTANCE, behavior: "smooth" })
)

leftArrow.addEventListener("click", () =>
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

