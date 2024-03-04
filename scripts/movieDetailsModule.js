'use strict';

import { addToFavorites } from './favorites.js';

export async function getMovieDetails(imdbID) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=[yourkey]&i=${imdbID}&plot=full`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
}

export function displayMovieDetails(movieDetails, container) {
    if (movieDetails && container) {
        container.innerHTML = `
            <div class="movie-details">
                <div class="poster-container">
                    <img src="${movieDetails.Poster}" alt="${movieDetails.Title} Poster">
                </div>
                <div class="movie-info">
                <h1>${movieDetails.Title}</h1>
                    <h2>Year: ${movieDetails.Year}</h2>
                    <h2>Rated: ${movieDetails.Rated}</h2>
                    <h2>Released: ${movieDetails.Released}</h2>
                    <h2>Runtime: ${movieDetails.Runtime}</h2>
                    <h2>Genre: ${movieDetails.Genre}</h2>
                    <h2>Director: ${movieDetails.Director}</h2>
                    <h2>Writer: ${movieDetails.Writer}</h2>
                    <h2>Actors: ${movieDetails.Actors}</h2>
                    <h2>Language: ${movieDetails.Language}</h2>
                    <h2>Country: ${movieDetails.Country}</h2>
                    <h3 class="plot-info">Plot: ${movieDetails.Plot}</h3>
                    <button id="addToFavoritesButton">Add to favorites</button>
                </div>
            </div>`;
    } else {
        console.error('Error: Movie details not available or container not found');
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    if (window.location.pathname.includes('movie.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const imdbID = urlParams.get('imdbID');

        if (imdbID) {
            const movieDetails = await getMovieDetails(imdbID);
            const container = document.getElementById('movieDetails');
            displayMovieDetails(movieDetails, container);
        } else {
            console.error('IMDb ID not found in URL parameters');
        }

        const addToFavoritesButton = document.getElementById('addToFavoritesButton');

        if (addToFavoritesButton) {
            addToFavoritesButton.addEventListener('click', async function () {
                const movieDetails = await getMovieDetails(imdbID);
                const movie = { Title: movieDetails.Title, imdbID: imdbID, Poster: movieDetails.Poster };
                addToFavorites(movie);
            });
        } else {
            console.error('Kunde inte hitta knappen med id "addToFavoritesButton".');
        }
    }
});