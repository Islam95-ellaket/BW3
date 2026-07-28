

const API_URL = `https://striveschool-api.herokuapp.com/api/deezer/search?q=queen`

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