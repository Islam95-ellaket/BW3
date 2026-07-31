const form = document.getElementById("bottone-input")
const btncerca = document.getElementById("bottone-cerca")
const search= document.querySelector('.navigation')
btncerca.addEventListener("click", (event) => {
  event.preventDefault()
  form.classList.toggle("apri")
  search.classList.toggle('chiudi')
})