const { omdbKey, gbooksKey } = require("./api");
const searchForm = document.querySelector("#searchForm");
searchForm.addEventListener("submit", omdbSearch);

const basedOnBook = (movie) => {
  const regExp = /novel|book|story|characters/i;
  if (regExp.test(movie.Writer)) {
    console.log(movie.Writer, "Yes, this movie is based on a book.");
    return true;
  } else {
    console.log(movie.Writer, "No, this movie is not based on a book.");
    return false;
  }
};

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
  cardButton.addEventListener("click", omdbTitleSearch);
  buttonDiv.append(cardButton);

  cardBodyDiv.append(cardTitle, buttonDiv);

  cardDiv.append(cardImage, cardBodyDiv);
  return cardDiv;
};

const createDetailedCard = async (movie) => {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("container", "row", "justify-content-center");
  cardContainer.id = "cardContainer";

  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card", "m-3", "col-md-6", "bg-dark", "text-light");

  const cardImage = document.createElement("img");
  cardImage.src = movie.Poster;
  cardImage.classList.add("card-img-top", "mt-3");

  const cardBodyDiv = document.createElement("div");
  cardBodyDiv.classList.add("card-body");

  const cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title");
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
  imdbLink.classList.add("card-link");
  imdbLink.innerText = "IMDB Link";
  imdbLink.href = `https://www.imdb.com/title/${movie.imdbID}/`;
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
    bookLink.innerText = "Book Link";
    bookLink.href = book.volumeInfo.infoLink;
    cardBodyDiv2.append(imdbLink, bookLink);
  } else {
    listItem3.innerText = "This movie is not based on a book.";
    cardBodyDiv2.append(imdbLink);
  }

  cardBodyDiv.append(cardTitle, cardText);
  list.append(listItem1, listItem2, listItem3);
  cardDiv.append(cardImage, cardBodyDiv, list, cardBodyDiv2);
  cardContainer.append(cardDiv);
  document.querySelector("#mainContainer").append(cardContainer);
};

const clearImages = () => {
  const cardContainer = document.querySelector("#cardContainer");
  if (cardContainer) {
    cardContainer.parentElement.removeChild(cardContainer);
  }
};

const createRow = () => {
  const rowDiv = document.createElement("div");
  rowDiv.classList.add("row");
  return rowDiv;
};

async function omdbSearch(e) {
  try {
    e.preventDefault();
    const searchTerm = searchForm.elements.searchQuery.value;
    const config = { params: { s: searchTerm } };
    const response = await axios.get(
      `http://www.omdbapi.com/?&apikey=${omdbKey}`,
      config
    );
    const movies = response.data.Search;
    clearImages();
    createImages(movies);
    searchForm.elements.searchQuery.value = "";
  } catch (e) {
    console.log("Error!", e);
  }
}

async function omdbTitleSearch(e) {
  try {
    e.preventDefault();
    const movieTitle = this.parentElement.previousSibling.innerText;
    const config = { params: { t: movieTitle, plot: "full" } };
    const response = await axios.get(
      `http://www.omdbapi.com/?&apikey=${omdbKey}`,
      config
    );
    const movie = response.data;
    clearImages();
    createDetailedCard(movie);
  } catch (e) {
    console.log("Error!", e);
  }
}
