//getElement x HEADER album
const albumImg = document.getElementById('albumImg')
const artistImg = document.getElementById('artistImg')
const albumType = document.getElementById('albumType')
const albumTitle = document.getElementById('albumTitle')
const albumArtist = document.getElementById('albumArtist')
const albumDuration = document.getElementById('albumDuration')

//getElement x LABEL album
const albumRelease = document.getElementById('albumRelease')
const albumLabel = document.getElementById('albumLabel')

//getElement x TRACKLIST
const trackRow = document.getElementById('trackRow')

//getElement x ALTRI ALBUM 
const otherAlbumsArtist=document.getElementById('otherAlbumsArtist')
const albumsContainer = document.getElementById('albumsContainer')



const params = new URLSearchParams(window.location.search)
const albumId = params.get('id')
console.log("ID recuperato nella pagina Album:", albumId);

const getAlbum = async (id) => {
    try {
        const res = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/${id}`)
        const album = await res.json()

        displayTracklist(album.tracks.data)

        console.log("Dati Album ricevuti:", album);
        albumImg.src = album.cover_medium
        artistImg.src = album.artist.picture_small
        albumType.innerText = capitalize(album.type)
        albumTitle.innerText = album.title
        albumArtist.innerText = album.artist.name
        albumDuration.innerText = formatDurationAlbum(album.duration)
        albumRelease.innerText = album.release_date
        albumLabel.innerText = album.label
        otherAlbumsArtist.innerText=`Altro di ${album.artist.name}`

        if (album.artist && album.artist.id) {
            getOtherAlbums(album.artist.id)
        }
    } catch (e) {
        console.log(e)
    }
}
getAlbum(albumId)

//funzione lettera maiuscola album
const capitalize = (text) => {
    return text[0].toUpperCase() + text.slice(1).toLowerCase();
}
//funzione per formattare i secondi in Minuti:Secondi
const formatDurationAlbum = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const paddedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes} min ${paddedSeconds} sec.`;
}
//funzione per formattare i secondi in Minuti:Secondi
const formatDurationTrack = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const paddedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${paddedSeconds}`;
}

//creazione tracklist
const createTracklist = (track,index) => {
    // <tr>
    //   <th scope="row" class="text-start" id="track">1</th>
    //   <td class="text-start" id="title">Mark</td>
    //   <td class="text-end pe-5" id="duration">Otto</td>
    // </tr>
    const trTracklist = document.createElement('tr')
    trTracklist.classList.add('my-5')

    const thTracklist = document.createElement('th')
    thTracklist.classList.add('text-start','align-middle')
    thTracklist.setAttribute('scope', 'row')
    thTracklist.innerText = index + 1

    const tdTracklistTitle = document.createElement('td')
    tdTracklistTitle.classList.add('text-start','align-middle')
    tdTracklistTitle.innerHTML = track.title

    const tdTracklistDuration= document.createElement('td')
    tdTracklistDuration.classList.add('text-end','align-middle','pe-5')
    tdTracklistDuration.innerHTML=formatDurationTrack(track.duration)

    trTracklist.append(thTracklist,tdTracklistTitle,tdTracklistDuration)
    return trTracklist
}

const displayTracklist = (tracks) => {
    if (!trackRow || !Array.isArray(tracks)) return;

    trackRow.innerHTML = ''
    const trTracks = tracks.map(createTracklist)
    trackRow.append(...trTracks)
}


// fetch otherAlbumArtist
const getOtherAlbums = async (artistId) => {
    try {
        const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/albums`)
        const result = await response.json()
        
        console.log("Album trovati per questo artista:", result.data)
        displayOtherAlbums(result.data)
    } catch (e) {
        console.error("Errore nel recupero degli altri album:", e)
    }
}
//card ALBUM footer
const createAlbumCards = (album) => {
    const albumId = album.album ? album.album.id : album.id
    console.log("Stai creando la card per l'ALBUM ID:", albumId)

    const colAlbums = document.createElement('div')
    colAlbums.classList.add('col', 'no-wrap', 'mt-3')

    const cardAlbum = document.createElement('div')
    cardAlbum.classList.add('card', 'cardAlbum')

    const imgAlbum = document.createElement('img')
    imgAlbum.classList.add('card-img-top', 'imgAlbum')
    imgAlbum.src = album.cover_medium

    const cardBodyAlbum = document.createElement('div')
    cardBodyAlbum.classList.add('card-body', 'd-flex', 'flex-column')
    cardBodyAlbum.style.paddingLeft = '0'

    const albumTitle = document.createElement('a')
    albumTitle.classList.add('card-title', 'albumTitle')
    albumTitle.innerText = album.title || (album.album ? album.album.title : '')
    albumTitle.href = `../album/album.html?id=${albumId}`

    const albumArtist = document.createElement('a')
    albumArtist.classList.add('card-text', 'albumArtistName')
    const headerArtistName = document.getElementById('albumArtist') ? document.getElementById('albumArtist').innerText : ''
    albumArtist.innerText = album.artist?.name || headerArtistName
    
    const cardPlay = document.createElement('a')
    cardPlay.classList.add('playButton')
    
    cardPlay.innerHTML = `<i class="bi bi-play-circle-fill"></i>`
    
    const goToAlbumPage = (e) => {
        e.stopPropagation()
        window.location.href = `../album/album.html?id=${albumId}`
    }

    cardPlay.addEventListener('click', goToAlbumPage)
    cardAlbum.addEventListener('click',goToAlbumPage)

    cardBodyAlbum.append(albumTitle, albumArtist)
    cardAlbum.append(imgAlbum, cardPlay, cardBodyAlbum)
    colAlbums.appendChild(cardAlbum)
    return colAlbums
}

const displayOtherAlbums = (albums) => {
    if (!albumsContainer || !Array.isArray(albums)) return;
    albumsContainer.innerHTML = ''

    const addedAlbumIds = new Set()

    const uniqueAlbums = albums.filter(item => {
        const idToCheck = item?.album?.id || item?.id
        
        if (!idToCheck || String(idToCheck) === String(albumId) || addedAlbumIds.has(idToCheck)) {
            return false;
        }
        addedAlbumIds.add(idToCheck)
        return true
    })

    const top10Albums = uniqueAlbums.slice(0, 10)
    console.log("Album mostrati nel footer:", top10Albums)

    const albumCards = top10Albums.map(createAlbumCards)
    albumsContainer.append(...albumCards)
}