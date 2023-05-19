const apiKey = '8a6f2b75'
const searchInput = document.getElementById('seach-text')
const moviesContainer = document.getElementById('results')
const favContainer = document.getElementById('fav')
const backBtn = document.getElementById('back-btn')
const favBtn = document.getElementById('watchlist-link')

let renderBool = false
let favouriteMovies = []

document.addEventListener('click', function (event) {
  if (event.target.dataset.fav) {
    localStorage.setItem(event.target.dataset.fav, '')
    document.getElementsByClassName(
      `${event.target.dataset.fav}`
    )[0].textContent = 'Added to watchlist'
  } else if (event.target.dataset.remove) {
    localStorage.removeItem(`${event.target.dataset.remove}`)
    // ADD REMOVE ITEM FROM HTML
    removeMovie(event.target.dataset.remove)
  } else if (event.target.id === 'search') {
    const searchText = searchInput.value
    const requestUrl = `https://www.omdbapi.com/?s=${searchText}&apikey=${apiKey}`
    fetch(requestUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.Response == 'False') {
          renderError()
        } else {
          moviesContainer.innerHTML = '' // Empty the container for each search
          movies = data.Search
          movies.forEach((movie) => {
            renderMovie(movie.imdbID)
          })
        }
      })
  }
})

function renderMovie(imdbID) {
  fetch(`https://www.omdbapi.com/?i=${imdbID}&type=movie&apikey=${apiKey}`)
    .then((response) => response.json())
    .then((data) => getHtmlMovie(data))
}

function getHtmlMovie(movieInfo) {
  const { Runtime, Genre, Plot, Poster, imdbRating, Title, imdbID } = movieInfo
  let text = '❤️ Add to watchlist'
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i) === imdbID) {
      text = 'Added to watchlist'
    }
  }
  moviesContainer.innerHTML += `
    <div class="each-movie">
        <img class="poster" src=${Poster} alt=${Title}>
        <div class="img-text">
            <h3>${Title}</h3>
            <p class="rating">⭐ ${imdbRating} </p>
            <div class="time">
                <p class="runtime">${Runtime} </p>
                <p class="genre">${Genre}</p>
                    <div class="button-container">
                        <button id="star" class=${imdbID} data-fav=${imdbID}>${text}</button>
                    </div>
            </div>
            <p class="plot">${Plot}</p>
        </div>
    </div>
    `
}

// Render local storage on the screen

if (backBtn) {
  if (localStorage.length === 0) {
    favContainer.innerHTML = `
        <div id="intro">
        <h1 id="intro-text">Nothing on your watchlist yet...</h1>
           <h1> Click <a href="index.html" id="search-movies"> here</a> to add some movies! 🍿 </h1>
            <i id="icon" class="fa-solid fa-film"></i>
        </div>.
        `
  }
  renderLocalStorage()
}

function renderLocalStorage() {
  for (let i = 0; i < localStorage.length; i++) {
    renderLocalStorageHtml(localStorage.key(i))
  }
}

function renderLocalStorageHtml(imdb) {
  fetch(`https://www.omdbapi.com/?i=${imdb}&type=movie&apikey=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      const { Runtime, Genre, Plot, Poster, imdbRating, Title, imdbID } = data
      favContainer.innerHTML += `
                <div class="each-movie" id=${imdbID}>
                
                    <img class="poster" src=${Poster} alt=${Title}>
                    <div class="img-text">
                        <h3>${Title}</h3>
                        <p class="rating">⭐ ${imdbRating} </p>
                        <div class="time">
                            <p class="runtime">${Runtime} </p>
                            <p class="genre">${Genre}</p>
                                <div class="button-container">
                                    <button id="star" class=${imdbID} data-remove=${imdbID}>Remove from watchlist</button>
                                </div>
                        </div>
                        <p class="plot">${Plot}</p>
                    </div>
                </div>

                `
    })
}

function removeMovie(imdb) {
  document.getElementById(imdb).remove()
  if (localStorage.length === 0) {
    favContainer.innerHTML = `
        <div id="intro">
            <h1 id="intro-text">Let's add some movies!</h1>
            <i id="icon" class="fa-solid fa-film"></i>
        </div>.
        `
  }
}

function renderError() {
  moviesContainer.innerHTML = `<h3 id="sorry">We couldn't find any movies matching your criteria. <br> <br> Please try a different search.</h3>`
}
