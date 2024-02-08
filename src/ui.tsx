import "./ui.css";
import "../node_modules/figma-plugin-ds/dist/figma-plugin-ds.css";
import { useRef, useState, useEffect } from "react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
//const GeoJSON2SVG = require("geojson2svg").GeoJSON2SVG;
function App() {
  const inputRef = useRef(null);
  const [isDisabled, setDisabled] = useState(false);
  const [countryName, setCountryName] = useState("");
  const [countryISO, setCountryISO] = useState("");
  const [geoJSON, setGeoJSON] = useState(null);
  const [svgContent, setSvgContent] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${countryName}`
      );
      const data = await response.json();

      if (data[0]?.cca3) {
        setCountryISO(data[0]?.cca3);
        console.log(data[0]?.cca3);
      } else {
        throw new Error("No ISO for country found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchGeo = async () => {
    try {
      const responseGeo = await fetch(
        `https://www.geoboundaries.org/api/current/gbOpen/${countryISO}/ADM0/`
      );
      const dataGeo = await responseGeo.json();

      if (dataGeo?.simplifiedGeometryGeoJSON) {
        console.log(dataGeo.simplifiedGeometryGeoJSON);
        setGeoJSON(dataGeo?.simplifiedGeometryGeoJSON);
      } else {
        throw new Error("No GeoJson for country found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // async function renderSVGFromURL(url) {
  //   try {
  //     fetch(url).then((r) => {
  //       r.json().then((d) => console.log(d.text()));
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
  // try {
  //   const response = await fetch(url);
  //   const reader = Readline.createInterface({
  //     input: response.body, // Use response body as input stream
  //   });

  //   let geoJSON = "";
  //   reader.on("line", (line) => {
  //     // Concatenate lines to form GeoJSON
  //     geoJSON += line;
  //   });

  //   reader.on("close", () => {
  //     // Parse GeoJSON string to JSON object
  //     const geoJSONObject = JSON.parse(geoJSON);
  //     // Convert GeoJSON to SVG
  //     const converter = new GeoJSON2SVG({
  //       viewportSize: { width: 200, height: 300 },
  //       output: "svg",
  //     });
  //     const svgStr = converter.convert(geoJSONObject);
  //     console.log("SVG:", svgStr);
  //     // Render the SVG content (e.g., write to file or display in browser)
  //     // Example: fs.writeFileSync('output.svg', svgStr);
  //   });
  // } catch (error) {
  //   console.error("Error:", error);
  // }
  //}

  // Example usage

  useEffect(() => {
    if (countryISO) {
      fetchGeo();
    }
  }, [countryISO]);

  const onSubmit = async (e) => {
    e.preventDefault();
    await fetchData();
    // await renderSVGFromURL(
    //   "https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/USA/ADM0/geoBoundaries-USA-ADM0_simplified.geojson"
    // );
    parent.postMessage({ pluginMessage: "Submit button clicked" }, "*");
  };

  const onChange = () => {
    if (inputRef.current?.value === "") {
      setDisabled(false);
    } else {
      setDisabled(true);
      setCountryName(inputRef.current?.value);
    }
  };

  return (
    <div className="App" style={{ background: "var(--figma-color-bg)" }}>
      <header>
        <h1>Map Sketcher</h1>
      </header>
      <main>
        <label htmlFor="input">Country name:</label>
        <div className="input input--with-icon">
          <div className="icon icon--search"></div>
          <input
            type="text"
            className="input__field"
            placeholder="Country.."
            id="input"
            ref={inputRef}
            onChange={onChange}
          />
        </div>
        <div>
          <h2>GeoJSON to SVG Converter</h2>
          {svgContent ? (
            <img src={svgContent} alt="" />
          ) : (
            <p>Loading GeoJSON data...</p>
          )}
        </div>
        <img style={{ width: "300px" }} src={geoJSON} alt="" />
      </main>
      <footer>
        {isDisabled ? (
          <button className="button button--primary" onClick={onSubmit}>
            Generete Map
          </button>
        ) : (
          <button className="button button--primary" disabled>
            Generete Map
          </button>
        )}
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
