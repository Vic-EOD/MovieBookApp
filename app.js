/* 
  This small applications uses only vanillaJS to select and manipulate the DOM
  as well as the built in fetch api therefore you do not technically need the 
  node_modules folder or any of its packages, the only package used here is browserify
  for using the require() method and that is only to keep api key secret without using
  a framework
  The two APIs used are: the OMBD API https://www.omdbapi.com/
  And: The Google Books API https://developers.google.com/books
  All stlying is done using BootStrap 5 
*/

//required files for the api keys
//only for security for upload to github
//use your own api keys
const { omdbKey, gbooksKey } = require("./api");

//selecting the search form from the DOM and adding a submit event listener
const searchForm = document.querySelector("#searchForm");
searchForm.addEventListener("submit", omdbSearch);

//function that returns a boolean for whether or not a
//movie is based on a book
//the chosen differentiator is whether or not the strings in
//the regExp variable are contained in the Writer property of
//the movie JSON from the OMDB API call
//API call originally happens inside of the omdbSearch function
const basedOnBook = (movie) => {
  const regExp = /novel|book|story|characters/i;
  if (regExp.test(movie.Writer)) {
    return true;
  } else {
    return false;
  }
};

//function that handles creation of all images for
//the array from the OMDB results, calls function createCard
//for each card
const createImages = (movies) => {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("container", "w-100");
  cardContainer.id = "cardContainer";

  const row = createRow();
  cardContainer.append(row);
  movies.forEach((movie) => {
    if (movie.Poster !== "N/A" && movie.Type !== "game") {
      row.append(createCard(movie));
    }
  });
  document.body.append(cardContainer);
};

//function for creating and styling the bootstrap card
//components that consist of an image and movie title from
//the OMDB API and a button for more details
const createCard = (movie) => {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add(
    "card",
    "m-3",
    "col-6",
    "col-md-4",
    "bg-transparent",
    "border-0"
  );
  cardDiv.style.width = "18rem";

  const cardImage = document.createElement("img");
  cardImage.src = movie.Poster;
  cardImage.classList.add("card-img-top", "mt-2", "rounded");

  const cardBodyDiv = document.createElement("div");
  cardBodyDiv.classList.add("card-body");

  const cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title", "text-center", "text-light");
  cardTitle.innerText = movie.Title;

  const buttonDiv = document.createElement("div");
  buttonDiv.classList.add("d-grid", "gap-2", "col-6", "mx-auto");
  const cardButton = document.createElement("a");
  cardButton.classList.add("btn", "btn-primary");
  cardButton.innerText = "Details";
  cardButton.type = "button";

  //add event listener to the details button, listener
  //function is omdbTitleSearch
  cardButton.addEventListener("click", omdbTitleSearch);
  buttonDiv.append(cardButton);

  cardBodyDiv.append(cardTitle, buttonDiv);

  cardDiv.append(cardImage, cardBodyDiv);
  return cardDiv;
};

//Creates a detailed card that consists of an image, adds a more detailed
//plot, an imdb rating, the release year, whether or not the movie is
//based on a book or not, and an imdb link all from the ODB API
//also adds a link to the book information if it is based on a book
const createDetailedCard = async (movie) => {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("container", "row", "justify-content-center");
  cardContainer.id = "cardContainer";

  const cardDiv = document.createElement("div");
  cardDiv.classList.add(
    "card",
    "m-3",
    "col-md-10",
    "bg-transparent",
    "border-0",
    "text-light"
  );

  const rowDiv = document.createElement("div");
  rowDiv.classList.add("row", "g-0");

  const col1Div = document.createElement("div");
  col1Div.classList.add("col-md-4");

  const cardImage = document.createElement("img");
  cardImage.src = movie.Poster;
  cardImage.classList.add("card-img");

  col1Div.append(cardImage);

  const col2Div = document.createElement("div");
  col2Div.classList.add("col-md-8");

  const cardBodyDiv = document.createElement("div");
  cardBodyDiv.classList.add("card-body");

  const cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title", "text-center");
  cardTitle.innerText = movie.Title;

  const cardText = document.createElement("p");
  cardText.classList.add("card-text");
  cardText.innerText = movie.Plot;

  const list = document.createElement("ul");
  list.classList.add("list-group", "list-group-flush");

  const listItem1 = document.createElement("li");
  listItem1.classList.add("list-group-item", "bg-transparent");
  listItem1.innerText = `IMDB Rating: ${movie.imdbRating}`;

  const listItem2 = document.createElement("li");
  listItem2.classList.add("list-group-item", "bg-transparent");
  listItem2.innerText = `Released ${movie.Released}`;

  const listItem3 = document.createElement("li");
  listItem3.classList.add("list-group-item", "bg-transparent");

  const cardBodyDiv2 = document.createElement("div");
  cardBodyDiv2.classList.add("card-body");

  const imdbLink = document.createElement("a");
  imdbLink.classList.add("card-link", "icon");
  imdbLink.innerHTML = '<img src="imdb.svg" class="icon">';
  imdbLink.href = `https://www.imdb.com/title/${movie.imdbID}/`;

  //if the movie is based on a book this adds a book link, else
  //only adds the string "This movie is not based on a book."
  //this if block is also the only caller of the google books api
  if (basedOnBook(movie)) {
    listItem3.innerText = "This movie is based on a book.";
    const config = {
      params: {
        q: movie.Title,
        key: gbooksKey,
      },
    };
    const response = await axios.get(
      "https://www.googleapis.com/books/v1/volumes?",
      config
    );
    const book = response.data.items[0];
    const bookLink = document.createElement("a");
    bookLink.classList.add("card-link");
    bookLink.innerText = "Book Info";
    bookLink.href = book.volumeInfo.infoLink;
    cardBodyDiv2.append(imdbLink, bookLink);
  } else {
    listItem3.innerText = "This movie is not based on a book.";
    cardBodyDiv2.append(imdbLink);
  }

  cardBodyDiv.append(cardTitle, cardText);
  list.append(listItem1, listItem2, listItem3);
  col2Div.append(cardBodyDiv, list, cardBodyDiv2);
  rowDiv.append(col1Div, col2Div);
  cardDiv.append(rowDiv);
  cardContainer.append(cardDiv);
  document.querySelector("#mainContainer").append(cardContainer);
};

//basic function clearing all card containers/images from the DOM
const clearImages = () => {
  const cardContainer = document.querySelector("#cardContainer");
  if (cardContainer) {
    cardContainer.parentElement.removeChild(cardContainer);
  }
};

//basic function creating a bootstrap row for general use
const createRow = () => {
  const rowDiv = document.createElement("div");
  rowDiv.classList.add("row");
  return rowDiv;
};

//main functino for OMDB API search call
//the paramaters are set up so that the api call returns 10 results
//the results are then turned into an array and the proper functions
//are called for clearing and creation of DOM elements
async function omdbSearch(e) {
  try {
    if (e.preventDefault) {
      e.preventDefault();
    }
    const searchTerm = searchForm.elements.searchQuery.value || e;
    const config = { params: { s: searchTerm } };
    const response = await axios.get(
      `http://www.omdbapi.com/?&apikey=${omdbKey}`,
      config
    );
    const movies = response.data.Search;
    clearImages();
    createImages(movies);
    searchForm.elements.searchQuery.value = "";
    state.page = "search";
    state.query = searchTerm;
    state.movie = {};
    console.dir(state);
    if (e.preventDefault) {
      history.pushState(state, "");
    }
  } catch (error) {
    console.log("Error!", error);
  }
}

//main functino for OMDB API single movie lookup
//the paramaters are set up so that the api call only returns one
//more detailed result
//the result is then turned into a detailed bootstrap card
async function omdbTitleSearch(e) {
  try {
    if (e.preventDefault) {
      e.preventDefault();
    }
    const movieTitle = e.Title || this.parentElement.previousSibling.innerText;
    const config = { params: { t: movieTitle, plot: "full" } };
    const response = await axios.get(
      `http://www.omdbapi.com/?&apikey=${omdbKey}`,
      config
    );
    const movie = response.data;
    clearImages();
    createDetailedCard(movie);
    state.page = "details";
    state.query = movieTitle;
    state.movie = movie;
    console.dir(state);
    if (e.preventDefault) {
      history.pushState(state, "");
    }
  } catch (error) {
    console.log("Error!", error);
  }
}

//handling of states/history
window.onpopstate = async (e) => {
  console.dir(e.state);
  if (e.state.page === "details") {
    omdbTitleSearch(e.state.movie);
  } else if (e.state.page === "search") {
    omdbSearch(e.state.query);
  } else {
    history.go();
  }
};
