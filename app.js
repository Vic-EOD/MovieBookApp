const searchForm = document.querySelector("#searchForm");
searchForm.addEventListener("submit", async function (e) {
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
});

const basedOnBook = (movie) => {
  const regExp = /novel|book|story|characters/i;
  if (regExp.test(movie.Writer)) {
    console.log("Yes, this movie is based on a book.");
  } else {
    console.log("No, this movie is not based on a book.");
  }
};

const createImages = (movies) => {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("container");
  cardContainer.id = "cardContainer";
  // for (let movie of movies) {
  //   if (movie.Poster !== "N/A") {
  //     cardContainer.append(createCard(movie));
  //   }
  // }
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
  cardDiv.classList.add("card", "m-3", "ms-0", "col-6", "col-md-4");
  cardDiv.style.width = "300px";

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
  cardButton.innerText = "Go Somewhere";
  cardButton.href = "#";

  cardBodyDiv.append(cardTitle, cardButton);

  cardDiv.append(cardImage, cardBodyDiv);
  return cardDiv;
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
