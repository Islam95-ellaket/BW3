const artists = ["Taylor Swift", "Billie Eilish", "Bad Bunny", "Sabrina Carpenter", "coldplay", "Chappell Roan", "Ariana Grande", "Post Malone"]
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