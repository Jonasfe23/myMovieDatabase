'use strict';

export async function showTop20Movies(containerElement) {
    if (!containerElement) {
        console.error('Container element is null or not defined');
        return;
    }

    try {
        const response = await fetch('https://santosnr6.github.io/Data/movies.json');
        const movies = await response.json();

        movies.slice(0, 20).forEach(({ title, poster, imdbid }) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('popular__card');

            const titleElement = document.createElement('h2');
            titleElement.textContent = title;
            cardElement.appendChild(titleElement);

            const posterElement = document.createElement('img');
            posterElement.src = poster;
            posterElement.alt = titleElement.textContent;
            cardElement.appendChild(posterElement);

            cardElement.dataset.imdbid = imdbid;

            containerElement.appendChild(cardElement);
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const containerElement = document.getElementById('popularCardContainer');
        await showTop20Movies(containerElement);
    } catch (error) {
        console.error('Error initializing top 20 movies:', error);
    }
});

