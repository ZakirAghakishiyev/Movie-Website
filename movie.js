const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");
movieFetch(movieId);


async function movieFetch(id) {
    const response = await fetch(`https://api.tvmaze.com/shows/${id}`);
    const movie = await response.json();

    document.getElementById("movie-title").textContent = movie.name;
    document.getElementById("movie-genre").textContent = movie.genres.join(" / ");
    document.getElementById("year").textContent = `${movie.premiered} - ${movie.ended ?? 'Ongoing'}`;
    document.getElementById("movie-duration").textContent = `${movie.averageRuntime} min`;
    document.getElementById("movie-image").src = movie.image.original;
    document.getElementById("movie-description").innerHTML = movie.summary;
}
