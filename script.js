
const apiEndpoint = "https://api.themoviedb.org/3";
const apikey= "c2dcf07171c7e3fab4b50c4d16dcf6bc";
const imgPath = "http://image.tmdb.org/t/p/original";

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMmRjZjA3MTcxYzdlM2ZhYjRiNTBjNGQxNmRjZjZiYyIsInN1YiI6IjY0ODg4ZGMzN2VmMzgxMDBlNjA5ODNkOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TALY36copTZCLbAqdlDbEH_Hs6D5YFFjc7GYnhXyc6o'
  }
};


const apiPaths = {
	fetchAllCategories :`${apiEndpoint}/genre/movie/list?api_Key=${apikey}`,
  fetchMoviesList : (id)=>`${apiEndpoint}/discover/movie?api_Key=${apikey}&with_genres=${id}`,
  fetchTrending : `${apiEndpoint}/trending/all/day?api_Key=${apikey}&language-en-US`,
  upcoming: `${apiEndpoint}/movie/upcoming?language=en-US&page=1`,
}


function init(){
  upcomingMoviesNow();
  fetchTrendingMovies();
 fetchAndBuildAllSections();
}

function upcomingMoviesNow(){
     fetchAndbuildMovieSection(apiPaths.upcoming,'Upcoming')
     .then(list=>{
      const randomIndex = parseInt(Math.random()* list.length);
      buildBannerSection(list[randomIndex]);
     }).catch(err => console.error(err));
}


function fetchTrendingMovies(){
     fetchAndbuildMovieSection(apiPaths.fetchTrending,'Trending Now')
     .then(list=>{
      const randomIndex = parseInt(Math.random()* list.length);
      buildBannerSection(list[randomIndex]);
     }).catch(err => console.error(err));
}

function buildBannerSection(movies){
    const bannerCont = document.getElementById('banner-section');
    bannerCont.style.backgroundImage =`url('${imgPath}${movies.backdrop_path}')`;

    const div = document.createElement('div')
    div.innerHTML= `
    <div class="banner-content container">
      <h2 class="banner-title">${movies.title}</h2>
      <p class="banner-info">Released ${movies.release_date}</p>
      <p class="banner-overview">${movies.overview.slice(0, 200)}</p>
      <div class="action-button">
        <button class="action-btn"><img width="20" height="20" src="https://img.icons8.com/fluency-systems-regular/48/play--v1.png" alt="play--v1"/> Play</button>
        <button class="action-btn"><img width="20" class="btn-info" height="20" src="https://img.icons8.com/ios/50/info--v1.png" alt="info--v1"/> More Info</button>
      </div>
      </div>`
    bannerCont.append(div);
}


function fetchAndBuildAllSections(){
    fetch(apiPaths.fetchAllCategories,options)
   .then(response => response.json())
   .then(res => {
    const categories = res.genres;
    if(Array.isArray(categories) && categories.length){
     categories.forEach(category => 
     fetchAndbuildMovieSection(
      apiPaths.fetchMoviesList(category.id),
      category.name))
    }
    //console.log(categories);
   })
  .catch(err => console.error(err));
}

   function fetchAndbuildMovieSection(fetchUrl, categoryName){
    //console.log(fetchUrl,category);
    return fetch(fetchUrl,options)
    .then(res=>res.json())
    .then(res=> { 
      console.log(res.results);
      const movies = res.results;
      if(Array.isArray(movies) && movies.length){
        buildMoviesSection(movies,categoryName);
      }
      return movies;
      })
    .catch(err => console.error(err));
    }

    function buildMoviesSection(list,categoryName) {
       //console.log(list,categoryName);

       const moviesCont = document.getElementById('movies-cont');

       const moviesListHTML = list.map(item =>{
        return `
        <img class="movie-item" src="${imgPath}${item.backdrop_path}" alt=${item.title} title="${item.original_title}">
        `;
       }).join('');

       const moviesSectionHTML = `
       
       <h2 class="movie-section-heading">${categoryName}<span class="explore-nudge"> &nbsp &nbsp Explore All</span></h2>
       <div class="movie-row">
        ${moviesListHTML}
       </div>
     

       `
       //console.log(moviesSectionHTML);

       const div = document.createElement('div');
       div.className = "movie-section"
       div.innerHTML = moviesSectionHTML;

       //append html into movies container

       moviesCont.append(div);
    }


 


window.addEventListener('load', function(){
  init();
  window.addEventListener('scroll' , function(){
    const header = document.getElementById('header');
    if(window.scrollY >5) header.classList.add('black-bg')
      else header.classList.remove('black-bg');
  })
})




