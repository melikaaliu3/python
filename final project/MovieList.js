import React, { useEffect, useState } from "react";
import API from "../services/api";

function MovieList() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    API.get("/movies").then(res => setMovies(res.data));
  }, []);

  return (
    <div>
      <h2>Movies</h2>
      <ul>
        {movies.map(m => (
          <li key={m.id}>{m.title} ({m.release_year})</li>
        ))}
      </ul>
    </div>
  );
}

export default MovieList;