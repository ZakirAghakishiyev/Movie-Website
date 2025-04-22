const header = document.querySelector('header');
const nav = document.querySelector('nav');
const navbarMenuBtn = document.querySelector('.navbar-menu-btn');
const gridCount = document.querySelector('.gridCount');
let currentPage = 0;

let apiPage = 0; 
let itemsPerPage = 20; 
let internalData = []; 

const navbarForm = document.querySelector('.navbar-form');
const navbarFormCloseBtn = document.querySelector('.navbar-form-close');
const navbarSearchBtn = document.querySelector('.navbar-search-btn');
const moviesGrid=document.getElementsByClassName('movies-grid')[0];
const movieCards=document.querySelector('.movie-card');
const moviesArr=[];
const nextPage=document.getElementById('nextPage');
const prevPage=document.getElementById("prevPage");
const pageIndicator=document.getElementById("pageIndicator");
banner();
gridCount.addEventListener('change', () => {
    itemsPerPage = Number(gridCount.value);
    currentPage = 0; 
    renderCurrentPage(); 
    updatePageIndicator();
});

async function init() {
    await movies(currentPage);
    updatePageIndicator();
    // loadMovies();  
}


// movieCards.addEventListener('click', ()=>{
//     const id=movieCards.id;
// });

async function banner(){
    const bannerId=(Math.random() * (240 - 1) + 1).toFixed(0);
    console.log(bannerId);
    const response = await fetch(`https://api.tvmaze.com/shows/${bannerId}`);
    const bannerMovie = await response.json();

    document.getElementById("bannerName").textContent = bannerMovie.name;
    document.getElementById("bannerGenre").textContent = bannerMovie.genres.join(" / ");
    document.getElementById("bannerYear").textContent = `${bannerMovie.premiered} - ${bannerMovie.ended}`;
    document.getElementById("bannerDuration").textContent = `${bannerMovie.averageRuntime} min`;
    document.getElementById("bannerImg").src = bannerMovie.image.original;
}


nextPage.addEventListener("click", async () => {
    const maxPages = Math.ceil(internalData.length / itemsPerPage);
    currentPage++;
    if (currentPage < maxPages) {
        renderCurrentPage();
    } else {
        apiPage++;
        await movies();
    }
});

prevPage.addEventListener("click", async () => {
    if (currentPage > 0) {
        currentPage--;
        renderCurrentPage();
    } else if (apiPage > 0) {
        apiPage--;
        await movies();
        currentPage = Math.floor(250 / itemsPerPage) - 1;
        renderCurrentPage();
    }
});

function updatePageIndicator() {
    pageIndicator.textContent = `Page ${currentPage + 1} of ${Math.ceil(internalData.length / itemsPerPage)}`;
}


// window.addEventListener('scroll',()=>{
//     console.log(window.scrollY) //scrolled from top
//     console.log(window.innerHeight) //visible part of screen
//     console.log(document.documentElement.scrollHeight) //total height of the page
//     if(window.scrollY + window.innerHeight+20 >= 
//     document.documentElement.scrollHeight){
//         console.log("bottom of the page")
//         moviesFetch();
//     }
// })

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
            <a href="movie.html?id=${item.id}">
                <div class="movie-card" id="${item.id}">
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
                </div>
            </a>`
        moviesGrid.innerHTML+=card;
    }
}



async function movies(apiPageNumber = 0) {
    const response = await fetch(`https://api.tvmaze.com/shows?&select=key1,key2,key3`);
    const data = await response.json();

    if (data.length === 0) {
        alert("No more shows available.");
        return;
    }

    internalData = data;
    currentPage = 0;
    renderCurrentPage();
}

function renderCurrentPage() {
    moviesGrid.innerHTML = "";
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    const visibleItems = internalData.slice(start, end);

    visibleItems.forEach(item => {
        let genresForCard = item.genres.join(" / ");
        let card = `
            <a href="movie.html?id=${item.id}">
                <div class="movie-card" id="${item.id}">
                    <div class="card-head">
                        <img src="${item.image.original}" alt="movie" class="card-img">
                        <div class="card-overlay">
                            <div class="bookmark"><ion-icon name="bookmark"></ion-icon></div>
                            <div class="rating"><ion-icon name="star-outline"></ion-icon><span>${item.rating.average ?? 'N/A'}</span></div>
                            <div class="play"><ion-icon name="play-circle-outline"></ion-icon></div>
                        </div>
                    </div>
                    <div class="card-body">
                        <h3 class="card-title">${item.name}</h3>
                        <div class="card-info">
                            <span class="genre">${genresForCard}</span>
                            <span class="year">Premiered: ${item.premiered}</span>
                            <span class="year">Ended: ${item.ended ?? 'Ongoing'}</span>
                        </div>
                    </div>
                </div>
            </a>`;
        moviesGrid.innerHTML += card;
    });

    updatePageIndicator();
}



function navIsActive(){
    header.classList.toggle('active');
    nav.classList.toggle('active');
    navbarMenuBtn.classList.toggle('active');
}

// function moviesFetch() {
//     let i=0;
//     while(i<16){
//         fetch(`https://api.tvmaze.com/shows?&select=key1,key2,key3`)
//     .then(response=>response.json())
//     .then(data=>{
//         moviesGrid.innerHTML+=`
//             <a href="movie.html?id=${data.id}">
//                 <div class="movie-card" id="${data.id}">
//                     <div class="card-head">
//                         <img src="${data.image.original}" alt="movie" class="card-img">

//                         <div class="card-overlay">

//                             <div class="bookmark">
//                                 <ion-icon name="bookmark"></ion-icon>
//                             </div>

//                             <div class="rating">
//                                 <ion-icon name="star-outline"></ion-icon>
//                                 <span>${data.rating.average}</span>
//                             </div>

//                             <div class="play">
//                                 <ion-icon name="play-circle-outline"></ion-icon>
//                             </div>
//                         </div>
//                     </div>

//                     <div class="card-body">
//                         <h3 class="card-title">${data.name}</h3>

//                         <div class="card-info">
//                             <span class="genre">${data.genres.join(" / ")}</span>
//                             <span class="year">Premiered: ${data.premiered}</span>
//                             <span class="year">Ended: ${data.ended}</span>
//                         </div>
//                     </div>
//                 </div>
//             </a>`;
//     });
//         i++;
//     }
// }

// async function movies() {
//     const response = await fetch(`https://api.tvmaze.com/shows?&select=key1,key2,key3`);
//     const data = await response.json();
//     for(let i in data){
//         //console.log(data[i]);
//         moviesArr.push(data[i]);
//     }
// }




navbarMenuBtn.addEventListener('click', navIsActive);

const searchBarIsActive = () => navbarForm.classList.toggle('active');

navbarSearchBtn.addEventListener('click', searchBarIsActive);
navbarFormCloseBtn.addEventListener('click', searchBarIsActive);