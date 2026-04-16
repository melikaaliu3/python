import React, { useState } from "react";
import API from "../services/api";

function MovieForm() {
  const [form, setForm] = useState({ title: "", release_year: "", director_id: "", genre_id: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/movies", form);
    alert("Movie added!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Movie</h2>
      <input placeholder="Title" onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <input placeholder="Release Year" onChange={(e) => setForm({ ...form, release_year: e.target.value })} />
      <input placeholder="Director ID" onChange={(e) => setForm({ ...form, director_id: e.target.value })} />
      <input placeholder="Genre ID" onChange={(e) => setForm({ ...form, genre_id: e.target.value })} />
      <button type="submit">Add</button>
    </form>
  );
}

export default MovieForm;