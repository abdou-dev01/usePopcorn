import { useState, useEffect } from "react";

const apiKey = "4465d097f11bca536e554ee8ff4b5e8a";
const urlMovieList = `https://api.themoviedb.org/3/search/movie`;

export function useMovie(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchData() {
        try {
          setError("");
          setIsLoading(true);
          const response = await fetch(
            `${urlMovieList}?api_key=${apiKey}&query=${encodeURIComponent(
              query
            )}`,
            { signal: controller.signal }
          );

          if (!response.ok)
            throw new Error(
              "Something went wrong with getting data, check your network."
            );
          const data = await response.json();

          if (data.Response === "False") throw new Error(data.Error);
          setMovies(data.results);
        } catch (error) {
          if (error.name !== "AbortError") setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      //   handleCloseMovie();
      fetchData();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
