import "./ui.css";
import "../node_modules/figma-plugin-ds/dist/figma-plugin-ds.css";
import { useRef, useState, useEffect, MouseEvent, KeyboardEvent } from "react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import fetch from "node-fetch";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDisabled, setDisabled] = useState(false);
  const [countryName, setCountryName] = useState<string>("");
  const [countryISO, setCountryISO] = useState<string>("");
  const [geoJSON, setGeoJSON] = useState<string>("");
  const [svgContent, setSvgContent] = useState<string>("");
  const GeoJSON2SVG = require("geojson2svg").GeoJSON2SVG;

  const fetchCountryISONumber = async (): Promise<void> => {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${countryName}`
      );
      const data = await response.json();
      if (response.ok) {
        setCountryISO(data[0]?.cca3);
      } else {
        throw new Error("No ISO code for country found" + response.status);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchGeoJSON = async (): Promise<void> => {
    try {
      const responseGeoBundaries = await fetch(
        `https://www.geoboundaries.org/api/current/gbOpen/${countryISO}/ADM0/`
      );
      const dataGeo = await responseGeoBundaries.json();

      if (responseGeoBundaries.ok) {
        //console.log("GeoJSONURL:" + dataGeo.simplifiedGeometryGeoJSON);
        const url: string = dataGeo.simplifiedGeometryGeoJSON
          .replace("github.com", "media.githubusercontent.com/media")
          .replace("/raw/", "/");
        await fetchGeoJSONData(url);
      } else {
        throw new Error(
          `Failed to fetch URL to GEOJSON. Status code: ${responseGeoBundaries.status}`
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchGeoJSONData = async (url: string): Promise<void> => {
    try {
      const responseFromGeoJsonURL = await fetch(url);

      if (responseFromGeoJsonURL.ok) {
        const geojson = await responseFromGeoJsonURL.json();
        setGeoJSON(geojson);
        //console.log("GeoJSONData:" + JSON.stringify(geojson));
      } else {
        throw new Error(
          `Failed to fetch GEOJSON. Status code: ${responseFromGeoJsonURL.status}`
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  async function convertGeoJSONToSVGPath(): Promise<void> {
    const converter = new GeoJSON2SVG({
      output: "path",
    });
    const svgStr = converter.convert(geoJSON);
    //console.log("SVG:", svgStr[0]);
    setSvgContent(svgStr[0]);
  }

  useEffect(() => {
    if (countryISO) {
      fetchGeoJSON();
    }
  }, [countryISO]);

  useEffect(() => {
    if (geoJSON) {
      convertGeoJSONToSVGPath();
    }
  }, [geoJSON]);

  useEffect(() => {
    if (svgContent) {
      onCreateFigma(svgContent);
    }
  }, [svgContent]);

  const submitByEnterButton = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.keyCode === 13) {
      onSubmit(event);
    }
  };

  const onSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await fetchCountryISONumber();
  };

  const onCreateFigma = async (svgContent: String) => {
    parent.postMessage(
      { pluginMessage: { type: "create-map", svgContent } },
      "*"
    );
  };

  const onChange = async () => {
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
            onKeyDown={(e) => submitByEnterButton(e)}
          />
        </div>
        <div>
          <h2>GeoJSON to SVG Converter</h2>
          {svgContent ? (
            <svg
              viewBox="-20 -20 300 200"
              width="300"
              height="200"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                fill: "red",
                border: "1px solid black",
              }}
            >
              <path d={`${svgContent}`} />
            </svg>
          ) : (
            <p>Loading GeoJSON data...</p>
          )}
        </div>
      </main>
      <footer>
        {isDisabled ? (
          <button className="button button--primary" onMouseDown={onSubmit}>
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
