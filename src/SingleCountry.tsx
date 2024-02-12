import * as React from "react";
import "./ui.css";
export const SingleCountry = ({ country, inputRef, onClick }) => {
  return (
    <li
      style={{
        fontSize: "12px",
        paddingBottom: "6px",
        cursor: "pointer",
        color: "black",
      }}
      className="single-country"
      onClick={(e) => {
        e.preventDefault();
        inputRef.current.value = country.toLowerCase();
        if (country === "United States") {
          inputRef.current.value = "usa";
        }
        onClick();
        inputRef.current.focus(); // so the enter works after assigning value from the list
        //alert(`You selected ${country}!`);
      }}
    >
      {country}
    </li>
  );
};
