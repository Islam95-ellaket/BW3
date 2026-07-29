const API_URL = `https://striveschool-api.herokuapp.com/api/deezer/search?q=artist`

const getArtist = async () => {
    try {
        const result = await fetch(`${API_URL}`)
        const data = await result.json()
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}
getArtist()


const createCardArtist = ({ name, picture_small }) => {
    const cardArtist = document.createElement('div')
    cardArtist.classList.add('card', 'bg-transparent')

    const cardArtistImage = document.createElement('img')
    cardArtistImage.classList.add('card-img-top', 'img-fluid', 'rounded-circle')
    cardArtistImage.src = picture_small
    cardArtistImage.alt = name

    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')

    const cardNameArtist = document.createElement('h5')
    cardNameArtist.classList.add('card-title')
    cardNameArtist.innerText = name
    cardBody.appendChild(cardNameArtist)

    const cardText = document.createElement('p')
    cardText.classList.add('card-text')
    cardText.innerText = 'Artist'
    cardBody.appendChild(cardText)

    cardArtist.append(cardArtistImage, cardBody)

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
