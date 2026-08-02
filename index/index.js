const form = document.getElementById("bottone-input")
const btncerca = document.getElementById("bottone-cerca")
const search = document.querySelector('.navigation')
const sfondo = document.getElementById('sfondo-accesso')
const menu = document.getElementById('menu')/* bottone */
const iconamenu = document.getElementById('icona-menu')/* svg del menu */
const closemenu = document.getElementById('chiusura-menu')/* svg X chiusura */
let aperto = false

btncerca.addEventListener("click", (event) => {
  event.preventDefault()
  form.classList.toggle("apri")
  search.classList.toggle('chiudi')
})

menu.addEventListener('click', (event) => {
  aperto = !aperto
  sfondo.classList.toggle("apri", aperto)

  if (aperto) {
    closemenu.style.display = 'block'
    iconamenu.style.display = 'none'
  } else {
    iconamenu.style.display = 'block'
    closemenu.style.display = 'none'
  }
})