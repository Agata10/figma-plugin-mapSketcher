import * as React from "react";
import "./ui.css";
export const Preview = ({ svgContent }) => {
  return (
    <div>
      <svg
        viewBox="0 0 300 300"
        width="300"
        height="300"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          fill: "lightCoral",
        }}
      >
        <path d={`${svgContent}`} />
      </svg>
    </div>
  );
};
