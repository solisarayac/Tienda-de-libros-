import React, { useState } from "react";
import BookList from "./components/Booklist.jsx";
import BookForm from "./components/Bookform.jsx";

const App = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="container p-4">
      <BookForm onBookAdded={() => setRefresh(!refresh)} />
      <BookList key={refresh} />
    </div>
  );
};

export default App;
