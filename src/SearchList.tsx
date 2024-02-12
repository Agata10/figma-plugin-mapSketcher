import { SingleCountry } from "./SingleCountry";
import * as React from "react";
import "./ui.css";

const style = {
  listStyleType: "none",
  paddingLeft: "0",
  height: "100px",
  window: "250px",
  overflow: "auto",
  fontFamily: "var(--font-stack)",
};

export const SearchList = ({ countries, inputRef, onClick }) => {
  return (
    <ul className="list" style={style}>
      {countries.map((country, id) => {
        if (
          country.name.common === "United States Virgin Islands" ||
          country.name.common === "United States Minor Outlying Islands"
        ) {
          return null;
        }
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
