import { useEffect, useRef, useState } from "react";
import StarRating from "./starRating";
import { useMovie } from "./useMovie";
import { useLocalStorage } from "./useLocalStorage";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// const API = "http://www.omdbapi.com/?apikey=";
// const API = "https://mp3quran.net/api/v3/reciters";
const apiKey = "4465d097f11bca536e554ee8ff4b5e8a";
const urlMovie = `https://api.themoviedb.org/3/movie`;

export default function App() {
  const [query, setQuery] = useState("x-men");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [watched, setWatched] = useLocalStorage([], "watched");

  const { movies, isLoading, error } = useMovie(query);

  function handleSelectMovie(id) {
    setSelectedMovie((selectedId) => (selectedId === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedMovie(null);
  }

  function handleAddMovie(newMovie) {
    setWatched((watched) => [...watched, newMovie]);
    handleCloseMovie();
    // console.log(watched);
  }

  function handleDeleteMovie(id) {
    setWatched((watched) => watched.filter((watch) => watch.imdbID !== id));
  }

  return (
    <>
      <NavBar movies={movies} query={query} setQuery={setQuery} />
      <Main>
        <MovieBox>
          {isLoading && <Loader />}
          {/* {movies ? <StartSearch /> } */}
          {!isLoading && !error && (
            <MoviesList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <MessageError message={error} />}
        </MovieBox>
        <MovieBox>
          {selectedMovie ? (
            <MovieDetails
              id={selectedMovie}
              onCloseMovie={handleCloseMovie}
              onAddMovie={handleAddMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList watched={watched} deleteMovie={handleDeleteMovie} />
            </>
          )}
        </MovieBox>
      </Main>
    </>
  );
}

function Loader() {
  return (
    <div className="loading">
      <div className="loader"></div>
      <p>Loading...</p>
    </div>
  );
}

function MessageError({ message }) {
  return <p className="error">{message}</p>;
}

function StartSearch() {
  return <p className="error">Start searching for your movie 😊.</p>;
}

function NavBar({ query, setQuery, movies }) {
  const search = useRef(null);

  useEffect(function () {
    search.current.focus();
  }, []);

  return (
    <nav className="nav-bar">
      <div className="logo">
        <span role="img">🍿</span>
        <h1>usePopcorn</h1>
      </div>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={search}
      />
      <p className="num-results">
        Found <strong>{movies.length}</strong> results
      </p>
    </nav>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function MovieBox({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MoviesList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.id} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  const width = "original";
  const width500 = "w500";
  const imagePath = `https://image.tmdb.org/t/p/${width}/`;
  return (
    <li onClick={() => onSelectMovie(movie.id)}>
      <img
        src={`${imagePath}${movie.poster_path}`}
        alt={`${movie.title} poster`}
      />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.release_date}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ id, onCloseMovie, onAddMovie, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState();

  const countRef = useRef(0);

  const didWatched = watched.some((watch) => watch.imdbID === id);
  const watchedUserRating = watched.find(
    (watch) => watch.imdbID === id
  )?.userRating;

  const {
    title,
    release_date,
    poster_path,
    runtime,
    vote_average,
    overview,
    status,
    actors,
    director,
    genres,
    countRating,
  } = movie;
  const genre = movie.genres?.map((gen) => gen.name).join(", ");

  function handleAddMovie() {
    const newWatched = {
      imdbID: id,
      title,
      release_date,
      poster_path,
      runtime,
      imdbRating: Number(vote_average),
      genre,
      userRating,
      countRating: countRef.current,
    };
    onAddMovie(newWatched);
  }

  useEffect(
    function () {
      if (userRating) countRef.current++;
    },
    [userRating]
  );

  useEffect(
    function () {
      async function fetchMovieDetail() {
        try {
          setIsLoading(true);
          const response = await fetch(`${urlMovie}/${id}?api_key=${apiKey}`);

          if (!response.ok)
            throw new Error(
              "Something went wrong with getting data, check your network."
            );
          const data = await response.json();
          setMovie(data);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchMovieDetail();
    },
    [id]
  );

  useEffect(
    function () {
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  useEffect(
    function () {
      function callBack(event) {
        if (event.code === "Escape") onCloseMovie();
      }
      document.addEventListener("keydown", callBack);

      return function () {
        document.removeEventListener("keydown", callBack);
      };
    },
    [onCloseMovie]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img
              src={`https://image.tmdb.org/t/p/original/${poster_path}`}
              alt={`poster for ${title} movie`}
            />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {release_date} &bull; {runtime} min
              </p>
              <p>{genre} </p>
              <p>
                <span>⭐</span>
                {vote_average} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {didWatched ? (
                <p>You rated this movie {watchedUserRating} ⭐.</p>
              ) : (
                <StarRating
                  size={26}
                  defaultRating={0}
                  onSetRating={setUserRating}
                />
              )}

              {userRating > 0 && (
                <button className="btn-add" onClick={handleAddMovie}>
                  + Add to your list
                </button>
              )}
            </div>
            <p>
              <em>{overview}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(
    watched.map((movie) => movie.imdbRating)
  ).toFixed(1);
  const avgUserRating = average(
    watched.map((movie) => movie.userRating)
  ).toFixed(1);
  const avgRuntime =
    isNaN(average(watched.map((movie) => movie.runtime))) && "";

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedList({ watched, deleteMovie }) {
  return (
    <ul className="list list-movies">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img
            src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
            alt={`${movie.title} poster`}
          />
          <h3>{movie.title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.runtime} min</span>
            </p>
          </div>
          <button
            className="btn-delete"
            onClick={() => deleteMovie(movie.imdbID)}
          >
            ❌
          </button>
        </li>
      ))}
    </ul>
  );
}
