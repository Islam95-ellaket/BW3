const rowArtist = document.getElementById('rowArtist')

const API_URL = `https://striveschool-api.herokuapp.com/api/deezer/search?q=artist`

const getArtist = async () => {
    try {
        const result = await fetch(API_URL)
        const data = await result.json()
        console.log(data)

        data.data.forEach(({ artist }) => {
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
    cardNameArtist.classList.add( 'text-white', 'my-0', 'small', 'fw-semibold')
    cardNameArtist.innerText = name
    
    const cardText = document.createElement('p')
    cardText.classList.add('card-text', 'text-secondary', 'small')
    cardText.innerText = type
    
    cardArtist.append(cardArtistImage, cardNameArtist, cardText)

    return cardArtist
}
