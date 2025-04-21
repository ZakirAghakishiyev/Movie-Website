const header = document.querySelector('header');
const nav = document.querySelector('nav');
const navbarMenuBtn = document.querySelector('.navbar-menu-btn');

const navbarForm = document.querySelector('.navbar-form');
const navbarFormCloseBtn = document.querySelector('.navbar-form-close');
const navbarSearchBtn = document.querySelector('.navbar-search-btn');
const moviesGrid=document.getElementsByClassName('movies-grid')[0];
const moviesArr=[];
async function init() {
    await movies();
    loadMovies();  
}

init();
function loadMovies(){
    for(let item of moviesArr){
        let genresForCard="";
        for(let index=0;index< item.genres.length;index++){
            genresForCard+=item.genres[index]
            if(index===item.genres.length-1) continue;
            genresForCard+="/";
        }
        card=`
            <div class="movie-card">
                <div class="card-head">
                    <img src="${item.image.original}" alt="movie" class="card-img">

                    <div class="card-overlay">

                        <div class="bookmark">
                            <ion-icon name="bookmark"></ion-icon>
                        </div>

                        <div class="rating">
                            <ion-icon name="star-outline"></ion-icon>
                            <span>${item.rating.average}</span>
                        </div>

                        <div class="play">
                            <ion-icon name="play-circle-outline"></ion-icon>
                        </div>
                    </div>
                </div>

                <div class="card-body">
                    <h3 class="card-title">${item.name}</h3>

                    <div class="card-info">
                        <span class="genre">${genresForCard}</span>
                        <span class="year">Premiered: ${item.premiered}</span>
                        <span class="year">Ended: ${item.ended}</span>
                    </div>
                </div>
            </div>`
        moviesGrid.innerHTML+=card;

    }
}

function navIsActive(){
    header.classList.toggle('active');
    nav.classList.toggle('active');
    navbarMenuBtn.classList.toggle('active');
}

async function movies() {
    const response = await fetch(`https://api.tvmaze.com/shows?&select=key1,key2,key3`);
    const data = await response.json();
    for(let i in data){
        //console.log(data[i]);
        moviesArr.push(data[i]);
    }
}

navbarMenuBtn.addEventListener('click', navIsActive);

const searchBarIsActive = () => navbarForm.classList.toggle('active');

navbarSearchBtn.addEventListener('click', searchBarIsActive);
navbarFormCloseBtn.addEventListener('click', searchBarIsActive);