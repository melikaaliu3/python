import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import MovieList from "./components/MovieList";
import MovieForm from "./components/MovieForm";

function App() {
  const [auth, setAuth] = useState(false);

  return (
    <div>
      <h1>Movie Management System</h1>
      {!auth ? (
        <>
          <Login setAuth={setAuth} />
          <Register />
        </>
      ) : (
        <>
          <MovieForm />
          <MovieList />
        </>
      )}
    </div>
  );
}

export default App;