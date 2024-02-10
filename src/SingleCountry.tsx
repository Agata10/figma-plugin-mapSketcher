import * as React from "react";
import "./ui.css";
export const SingleCountry = ({ country, inputRef, onClick }) => {
  return (
    <li
      style={{
        fontSize: "12px",
        paddingBottom: "10px",
        cursor: "pointer",
        color: "black",
      }}
      className="single-country"
      onClick={(e) => {
        e.preventDefault();
        inputRef.current.value = country.toLowerCase();
        onClick();
        //alert(`You selected ${country}!`);
      }}
    >
      {country}
    </li>
  );
};
