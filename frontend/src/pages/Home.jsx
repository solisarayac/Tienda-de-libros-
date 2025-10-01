import { useState } from "react";
import React from "react";
import BookForm from "../components/BookForm";
import BookList from "../components/BookList";

const Home = () => {
  const [reload, setReload] = useState(false);

  const handleBookAdded = () => setReload(!reload);

  return (
    <div className="container">
      <h1>Biblioteca Escolar</h1>
      <BookForm onBookAdded={handleBookAdded} />
      <BookList key={reload} />
    </div>
  );
};

export default Home;
