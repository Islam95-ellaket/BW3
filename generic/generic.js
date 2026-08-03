// funzione per abilitare lo slider
const sidebar = document.querySelector(".sidebar")
const resizer = document.getElementById("resizer")

let isResizing = false

resizer.addEventListener("mousedown", () => {
    isResizing = true
    document.body.style.cursor = "col-resize"
})

document.addEventListener("mousemove", (e) => {
    if (!isResizing) return

    const newWidth = e.clientX

    if (newWidth >= 180 && newWidth <= 420) {
        sidebar.style.width = `${newWidth}px`
    }
})

document.addEventListener("mouseup", () => {
    isResizing = false
    document.body.style.cursor = "default"
})



// -------- js modale -------- //

document.addEventListener('DOMContentLoaded', () => {
    const signupBanner = document.getElementById('signupBanner')
    const closeBannerBtn = document.getElementById('closeBannerBtn')
    const openModalBtn = document.getElementById('openModalBtn')
    const signupModal = document.getElementById('signupModal')
    const closeModalBtn = document.getElementById('closeModalBtn')
    const registerForm = document.getElementById('registerForm')

    if (!signupBanner || !closeBannerBtn || !openModalBtn || !signupModal || !closeModalBtn || !registerForm) {
        return
    }

    closeBannerBtn.addEventListener('click', () => {
        signupBanner.classList.add('hidden')
    })

    openModalBtn.addEventListener('click', () => {
        signupModal.classList.add('active')
        document.body.style.overflow = 'hidden'
    })

    const closeModal = () => {
        signupModal.classList.remove('active')
        document.body.style.overflow = ''
    }

    closeModalBtn.addEventListener('click', closeModal)

    signupModal.addEventListener('click', (e) => {
        if (e.target === signupModal) {
            closeModal()
        }
    })

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const email = document.getElementById('email').value
        const username = document.getElementById('username').value

        alert(`Registrazione completata per ${username} (${email})! Benvenuto su Spotify Clone.`)

        closeModal()
        signupBanner.classList.add('hidden')
    })
})
