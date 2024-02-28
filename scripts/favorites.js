'use strict';

export function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}

export function addToFavorites(movie) {
    const favorites = getFavorites();

    const existingMovie = favorites.find(m => m.imdbID === movie.imdbID);
    if (existingMovie) {
        alert('This movie is already in your favorites!');
        return; 
    }

    favorites.push(movie);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('The movie is added to your favorites!');
}

export function removeFromFavorites(movieId) {
    let favorites = getFavorites();
    favorites = favorites.filter(movie => movie.imdbID !== movieId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('This movie is removed from favorites!');
}

export function displayFavoriteMovies() {
    if (window.location.pathname.includes('favorites.html')) {
        const favoriteMoviesContainer = document.getElementById('favoriteMovies');

        if (favoriteMoviesContainer) {
            const favoriteMovies = getFavorites();
            favoriteMoviesContainer.innerHTML = '';

            favoriteMovies.forEach(movie => {
                const cardWrapper = document.createElement('div');
                cardWrapper.classList.add('my-card-wrapper');
                cardWrapper.classList.add('favorite-card-wrapper');

                const card = document.createElement('div');
                card.classList.add('favorite-card');
                card.style.display = 'grid';
                card.style.gridAutoFlow = 'row';

                const title = document.createElement('h2');
                title.textContent = movie.Title;
                title.classList.add('favorite-title');
                card.appendChild(title);

                const poster = document.createElement('img');
                poster.src = movie.Poster;
                poster.alt = movie.Title;
                card.appendChild(poster);

                cardWrapper.appendChild(card);
                const buttonWrapper = document.createElement('div');
                buttonWrapper.classList.add('button-wrapper');

                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.classList.add('favorite-button');
                removeButton.addEventListener('click', function () {
                    removeFromFavorites(movie.imdbID);
                    displayFavoriteMovies();
                });

                buttonWrapper.appendChild(removeButton);
                cardWrapper.appendChild(buttonWrapper);


                favoriteMoviesContainer.appendChild(cardWrapper);
            });
        } else {
            console.log('favoriteMovies container not found on favorites.html');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayFavoriteMovies();
});
