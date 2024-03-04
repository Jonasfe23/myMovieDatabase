'use strict';

window.addEventListener('load', () => {
  setupCarousel(); 

  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', function (event) {
      event.preventDefault();
      const movieTitle = document.getElementById('searchInput').value;
      fetchAndDisplaySearchResults(movieTitle);
    });
  } else {
    console.error('Search button not found.');
  }

  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('click', function () {
      const title = card.querySelector('p').textContent;
      const imdbID = card.dataset.imdbId;
      navigateToMoviePage(title, imdbID);
    });
  });
});

async function fetchMovies() {
  try {
    const response = await fetch('https://santosnr6.github.io/Data/movies.json');
    const movies = await response.json();
    return movies;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}

function shuffleMovies(movies) {
  return movies.sort(() => Math.random() - 0.5);
}

function showRandomMovies(movies, carouselElement) {
  const existingSlides = carouselElement.querySelectorAll('.carousel__slide');
  existingSlides.forEach(slide => slide.remove());

  const shuffledMovies = shuffleMovies(movies);
  const selectedMovies = shuffledMovies.slice(0, 5);

  selectedMovies.forEach(movie => {
    const slide = document.createElement('li');
    slide.classList.add('carousel__slide');

    const iframe = document.createElement('iframe');

    const embedLink = movie.trailer_link.replace('watch?v=', 'embed/nocookie/');

    iframe.src = embedLink;
    iframe.width = 420;
    iframe.height = 315;
    iframe.frameborder = 0;

    slide.appendChild(iframe);
    carouselElement.querySelector('ul[data-slides]').appendChild(slide);
  });

  const firstSlide = carouselElement.querySelector('[data-slides]').children[0];
  firstSlide.dataset.active = true;
}

function setupCarousel() {
  const buttons = document.querySelectorAll('[data-carousel-btn]');
  const carouselElement = document.querySelector('[data-carousel]');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const offset = btn.dataset.carouselBtn === 'next' ? 1 : -1;
      const slides = btn.closest('[data-carousel]').querySelector('[data-slides]');
      const activeSlide = slides.querySelector('[data-active]');

      let newIndex = [...slides.children].indexOf(activeSlide) + offset;

      if (newIndex < 0) {
        newIndex = slides.children.length - 1;
      } else if (newIndex >= slides.children.length) {
        newIndex = 0;
      }

      slides.children[newIndex].dataset.active = true;
      delete activeSlide.dataset.active;
    });
  });

  fetchMovies().then(movies => {
    showRandomMovies(movies, carouselElement);
  });
}

async function fetchAndDisplaySearchResults(movieTitle) {
  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=[yourkey]&s=${movieTitle}`);
    const data = await response.json();

    const searchResultsContainer = document.getElementById('searchResultsContainer');
    searchResultsContainer.innerHTML = '';

    if (data.Search) {
      data.Search.forEach(movie => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.imdbId = movie.imdbID;

        card.addEventListener('click', () => {
          console.log("IMDb ID för den klickade filmen:", movie.imdbID);
          navigateToMoviePage(movie.Title, movie.imdbID);
        });

        const title = document.createElement('h2');
        title.textContent = movie.Title;
        card.appendChild(title);

        const poster = document.createElement('img');
        poster.src = movie.Poster; 
        console.log(movie);
        poster.alt = `${movie.Title} Poster`;
        card.appendChild(poster);

        searchResultsContainer.appendChild(card); 
      });
    } else {
      searchResultsContainer.innerHTML = '<h2>No results found</h2>';
    }
  } catch (error) {
    console.error('Error fetching search results:', error);
  }
}

function navigateToMoviePage(title, imdbID) {
  window.location.href = `movie.html?title=${encodeURIComponent(title)}&imdbID=${imdbID}`;
}

