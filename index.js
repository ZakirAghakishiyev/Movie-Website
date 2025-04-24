const header = document.querySelector('header');
const nav = document.querySelector('nav');
const navbarMenuBtn = document.querySelector('.navbar-menu-btn');
const gridCount = document.querySelector('.gridCount');
const categoryGrid = document.querySelector('.category-grid');
let currentPage = 0;
let genres=[];
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
const yearSelect=document.getElementById("yearSelect");
let categoryFilter="all";
let sortBy="featured";
const radioButtons = document.querySelectorAll('input[name="grade"]');
const searchBar=document.getElementById('searchBtn');
const searchInput=document.getElementById('searchInput');
const pagination =document.querySelector('.pagination');

navbarForm.addEventListener('submit', (event) => {
    event.preventDefault(); 
});

banner();

function renderPaginationButtons(totalPages) {
    pagination.innerHTML = "";

    const prevBtn = document.createElement("button");
    prevBtn.id = "prevPage";
    prevBtn.textContent = "Previous";
    prevBtn.disabled = currentPage === 0;
    prevBtn.addEventListener("click", () => {
        if (currentPage > 0) {
            currentPage--;
            renderCurrentPage(yearSelect.value, categoryFilter);
        }
    });
    pagination.appendChild(prevBtn);

    if(currentPage > 2){
        const firstPageBtn = document.createElement("button");
        firstPageBtn.id="1"
        firstPageBtn.textContent = "1";
        pagination.appendChild(firstPageBtn);
        if(currentPage > 3){
            console.log("dots")
            const dots = document.createElement("button");
            dots.textContent = "...";
            pagination.appendChild(dots);
        }
    }

    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, startPage + 4);
    if (endPage - startPage < 4) {
        startPage = Math.max(0, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = (i + 1).toString();
        if (i === currentPage) {
            pageBtn.classList.add("active");
            pageBtn.style.backgroundColor = "#007BFF"; // Different color for the current page
            pageBtn.style.color = "#FFFFFF"; // Text color for better contrast
        }
        pageBtn.addEventListener("click", () => {
            currentPage = i;
            renderCurrentPage(yearSelect.value, categoryFilter);
        });
        pagination.appendChild(pageBtn);
    }

    if(currentPage < totalPages - 3){
        if(currentPage < totalPages - 4){
            console.log("dots")
            const dots = document.createElement("button");
            dots.textContent = "...";
            pagination.appendChild(dots);
        }
        const lastPageBtn = document.createElement("button");
        lastPageBtn.id = totalPages.toString();
        lastPageBtn.textContent = totalPages.toString();
        pagination.appendChild(lastPageBtn);
    }


    const nextBtn = document.createElement("button");
    nextBtn.id = "nextPage";
    nextBtn.textContent = "Next";
    nextBtn.disabled = currentPage === totalPages - 1;
    nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            renderCurrentPage(yearSelect.value, categoryFilter);
        }
    });
    pagination.appendChild(nextBtn);
}

gridCount.addEventListener('change', () => {
    itemsPerPage = Number(gridCount.value);
    currentPage = 0; 
    renderCurrentPage(); 
    updatePageIndicator();
});
yearSelect.addEventListener('change', () => {
    currentPage = 0;
    renderCurrentPage(yearSelect.value, categoryFilter);
});

categoryGrid.addEventListener('click', (event)=>{
    const button = event.target.closest('button');
    categoryFilter = button.id;
    currentPage = 0;
    renderCurrentPage(yearSelect.value, categoryFilter);
});

searchBar.addEventListener('click', async () => {
    const query = searchInput.value;
    if(query==="") {
        pagination.style.visibility="visible";
        location.reload();
        return;
    }
    pagination.style.visibility = "hidden";
    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
    const searchResults = await response.json();

    moviesGrid.innerHTML = ""; 

    searchResults.forEach(item => {
        const show = item.show;
        let genresForCard = show.genres.join(" / ");
        let card = `
            <a href="movie.html?id=${show.id}">
                <div class="movie-card" id="${show.id}">
                    <div class="card-head">
                        <img src="${show.image?.original || 'placeholder.jpg'}" alt="movie" class="card-img">
                        <div class="card-overlay">
                            <div class="bookmark"><ion-icon name="bookmark"></ion-icon></div>
                            <div class="rating"><ion-icon name="star-outline"></ion-icon><span>${show.rating?.average ?? 'N/A'}</span></div>
                            <div class="play"><ion-icon name="play-circle-outline"></ion-icon></div>
                        </div>
                    </div>
                    <div class="card-body">
                        <h3 class="card-title">${show.name}</h3>
                        <div class="card-info">
                            <span class="genre">${genresForCard}</span>
                            <span class="year">Premiered: ${show.premiered ?? 'Unknown'}</span>
                            <span class="year">Ended: ${show.ended ?? 'Ongoing'}</span>
                        </div>
                    </div>
                </div>
            </a>`;
            console.log(card);
        moviesGrid.innerHTML += card;
    });
});

async function init() {
    await movies(currentPage);
    genresUpload();
    //updatePageIndicator();
    // loadMovies();  
}
radioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
        sortBy = radio.id; // "featured", "popular", "newest"
        currentPage = 0;
        renderCurrentPage(yearSelect.value, categoryFilter);
    });
});

function genresUpload(){
    
    for (let i = 0; i < genres.length; i++) {
        const card = `
            <button id=${genres[i]}>
                <div class="category-card" style="font-size: 40px; font-weight: bold; padding-top: 50px;">
                    <span>${genres[i]}</span>
                </div>
            </button>
        `;
        //console.log(card);
        categoryGrid.innerHTML += card;
    }
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

// function updatePageIndicator() {
//     pageIndicator.textContent = `Page ${currentPage + 1} of ${Math.ceil(internalData.length / itemsPerPage)}`;
// }


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

    const genreSet = new Set();
    data.forEach(show => {
        if (Array.isArray(show.genres)) {
            show.genres.forEach(genre => genreSet.add(genre));
        }
    });

    genres = Array.from(genreSet);
    console.log(genres);
    internalData = data;
    currentPage = 0;
    renderCurrentPage();
}


function renderCurrentPage(yearFilter = "all", genreFilter = "all") {
    moviesGrid.innerHTML = "";

    let filteredData = internalData.filter(item => {
        const year = item.premiered ? parseInt(item.premiered.split("-")[0]) : null;
        const matchesYear = (() => {
            if (!year) return false;
            switch (yearFilter) {
                case "2024": return year === 2024;
                case "2020s": return year >= 2020 && year <= 2023;
                case "2010s": return year >= 2010 && year <= 2019;
                case "2000s": return year >= 2000 && year <= 2009;
                case "1990s": return year >= 1990 && year <= 1999;
                case "1980s": return year >= 1980 && year <= 1989;
                default: return true;
            }
        })();

        const matchesGenre = genreFilter === "all" || item.genres.includes(genreFilter);

        return matchesYear && matchesGenre;
    });

    filteredData.sort((a, b) => {
        switch (sortBy) {
            case "popular": 
                return (b.rating.average || 0) - (a.rating.average || 0);
            case "newest": 
                return new Date(b.premiered) - new Date(a.premiered);
            default: 
                return a.id - b.id;
        }
    });

    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    const visibleItems = filteredData.slice(start, end);

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

    //pageIndicator.textContent = `Page ${currentPage + 1} of ${Math.ceil(filteredData.length / itemsPerPage)}`;

    renderPaginationButtons(Math.ceil(filteredData.length / itemsPerPage));

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