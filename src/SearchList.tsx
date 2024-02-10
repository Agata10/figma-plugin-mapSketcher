import { SingleCountry } from "./SingleCountry";
import * as React from "react";
import "./ui.css";

const style = {
  listStyleType: "none",
  paddingLeft: "0",
  height: "200px",
  overflow: "auto",
  fontFamily: "var(--font-stack)",
};

export const SearchList = ({ countries, inputRef, onClick }) => {
  return (
    <ul className="list" style={style}>
      {countries.map((country, id) => {
        return (
          <SingleCountry
            country={country.name.common}
            key={id}
            inputRef={inputRef}
            onClick={onClick}
          />
        );
      })}
    </ul>
  );
};