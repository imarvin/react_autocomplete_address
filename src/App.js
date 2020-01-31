import React from "react";
import "./App.scss";
import Nav from "./components/Nav";
import SearchForm from "./components/SearchForm";
import SearchContextProvider from "./contexts/SearchContext";

export default function App() {
  return (
    <div className="App">
      <SearchContextProvider>
        <Nav />
        <main className="main">
          <SearchForm />
        </main>
      </SearchContextProvider>
    </div>
  );
}
