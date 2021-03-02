const searchForm = document.querySelector("#searchForm");
searchForm.addEventListener("submit", omdbSearch);

const basedOnBook = (movie) => {
  const regExp = /novel|book|story|characters/i;
  if (regExp.test(movie.Writer)) {
    console.log("Yes, this movie is based on a book.");
    return true;
  } else {
    console.log("No, this movie is not based on a book.");
    return false;
  }
};

const createImages = (movies) => {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("container");
  cardContainer.id = "cardContainer";
  let row = createRow();
  cardContainer.append(row);
  movies.forEach((movie, i) => {
    if (i % 3 === 0) {
      row = createRow();
      cardContainer.append(row);
    }

    if (movie.Poster !== "N/A") {
      row.append(createCard(movie));
    }
  });
  document.body.append(cardContainer);
};

const createCard = (movie) => {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card", "m-3", "col-6", "col-md-4");
  cardDiv.style.width = "18rem";

  const cardImage = document.createElement("img");
  cardImage.src = movie.Poster;
  cardImage.classList.add("card-img-top");

  const cardBodyDiv = document.createElement("div");
  cardBodyDiv.classList.add("card-body");

  const cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title");
  cardTitle.innerText = movie.Title;

  const cardButton = document.createElement("a");
  cardButton.classList.add("btn", "btn-primary");
  cardButton.innerText = "Details";
  cardButton.href = "#";
  cardButton.addEventListener("click", omdbTitleSearch);

  cardBodyDiv.append(cardTitle, cardButton);

  cardDiv.append(cardImage, cardBodyDiv);
  return cardDiv;
};

const createDetailedCard = (movie) => {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add(
    "container",
    "w-70",
    "row",
    "justify-content-center"
  );
  cardContainer.id = "cardContainer";

  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card", "w-50", "m-3");

  const cardImage = document.createElement("img");
  cardImage.src = movie.Poster;
  cardImage.classList.add("card-img-top");

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
  listItem1.classList.add("list-group-item");
  listItem1.innerText = `IMDB Rating: ${movie.imdbRating}`;

  const listItem2 = document.createElement("li");
  listItem2.classList.add("list-group-item");
  listItem2.innerText = `Released ${movie.Released}`;

  const cardBodyDiv2 = document.createElement("div");
  cardBodyDiv2.classList.add("card-body");

  const imdbLink = document.createElement("a");
  imdbLink.classList.add("card-link");
  imdbLink.innerText = "IMDB Link";
  imdbLink.href = `https://www.imdb.com/title/${movie.imdbID}/`;

  const listItem3 = document.createElement("li");
  listItem3.classList.add("list-group-item");

  cardBodyDiv.append(cardTitle, cardText);
  list.append(listItem1, listItem2);
  cardBodyDiv2.append(imdbLink);
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
  rowDiv.classList.add("row", "justify-content-center");
  return rowDiv;
};

async function omdbSearch(e) {
  try {
    e.preventDefault();
    const searchTerm = searchForm.elements.searchQuery.value;
    const config = { params: { s: searchTerm } };
    const response = await axios.get(
      "http://www.omdbapi.com/?&apikey=eeca96f7&",
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
    const movieTitle = this.previousSibling.innerText;
    const config = { params: { t: movieTitle, plot: "full" } };
    const response = await axios.get(
      "http://www.omdbapi.com/?&apikey=eeca96f7&",
      config
    );
    const movie = response.data;
    clearImages();
    createDetailedCard(movie);
  } catch (e) {
    console.log("Error!", e);
  }
}
