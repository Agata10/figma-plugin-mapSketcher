import "./ui.css";
import "../node_modules/figma-plugin-ds/dist/figma-plugin-ds.css";
import { useRef, useState, useEffect, MouseEvent } from "react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import fetch from "node-fetch";
import { SearchList } from "./SearchList";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDisabled, setDisabled] = useState(false);
  const [countryName, setCountryName] = useState<string>("");
  const [svgContent, setSvgContent] = useState<string>("");
  const [countriesList, setCountriesList] = useState<string>("");
  const [renderList, setRenderList] = useState(true);
  const [error, setError] = useState(false);
  const GeoJSON2SVG = require("geojson2svg").GeoJSON2SVG;

  const fetchCountryISONumber = async (): Promise<String> => {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}`
    );
    const data = await response.json();
    if (response.ok) {
      //setCountryISO(data[0]?.cca3);
      setError(false);
      setCountryName("");
      return data[0]?.cca3;
    } else {
      setError(true);
      throw new Error("No ISO code for country found" + response.status);
    }
  };

  const fetchGeoJSON = async (isoNumber: String): Promise<string> => {
    const responseGeoBundaries = await fetch(
      `https://www.geoboundaries.org/api/current/gbOpen/${isoNumber}/ADM0/`
    );
    const dataGeo = await responseGeoBundaries.json();
    if (responseGeoBundaries.ok) {
      //console.log("GeoJSONURL:" + dataGeo.simplifiedGeometryGeoJSON);
      const url: string = dataGeo.simplifiedGeometryGeoJSON
        .replace("github.com", "media.githubusercontent.com/media")
        .replace("/raw/", "/");
      return url;
    } else {
      throw new Error(
        `Failed to fetch URL to GEOJSON. Status code: ${responseGeoBundaries.status}`
      );
    }
  };

  const fetchGeoJSONData = async (url: string): Promise<string> => {
    const responseFromGeoJsonURL = await fetch(url);
    if (responseFromGeoJsonURL.ok) {
      const geojson = await responseFromGeoJsonURL.json();
      return geojson;
      //console.log("GeoJSONData:" + JSON.stringify(geojson));
    } else {
      throw new Error(
        `Failed to fetch GEOJSON. Status code: ${responseFromGeoJsonURL.status}`
      );
    }
  };

  const convertGeoJSONToSVGPath = async (data: string): Promise<void> => {
    const converter = new GeoJSON2SVG({
      output: "path",
    });
    const svgStr = converter.convert(data);
    //console.log("SVG:", svgStr[0]);
    setSvgContent(svgStr[0]);
  };

  const fetchData = async () => {
    try {
      const isoNumber = await fetchCountryISONumber();
      const geoJsonURL = await fetchGeoJSON(isoNumber);
      const geoJsonData = await fetchGeoJSONData(geoJsonURL);
      await convertGeoJSONToSVGPath(geoJsonData);
    } catch (err) {
      console.log("Failed to catch data.");
    }
  };

  useEffect(() => {
    if (countryName !== "") {
      fetchData();
    }
  }, [countryName]);

  useEffect(() => {
    if (svgContent) {
      onCreateFigma(svgContent);
    }
  }, [svgContent]);

  const submitByEnterButton = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      setCountryName(inputRef.current?.value);
      setRenderList(false);
    }
  };

  const onSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCountryName(inputRef.current?.value);
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
      setRenderList(false);
    } else {
      setDisabled(true);
      setError(false);
      fetchNames(inputRef.current?.value.toLowerCase());
      setRenderList(true);
    }
  };

  const handleCountryClick = () => {
    setRenderList(false);
  };

  const fetchNames = (value: String) => {
    fetch("https://restcountries.com/v3.1/all?fields=name")
      .then((response) => response.json())
      .then((json) => {
        const names = json.filter((countries) => {
          let result =
            value &&
            countries &&
            countries.name.common &&
            countries.name.common.toLowerCase().includes(value);

          return result;
        });
        setCountriesList(names);
      });
  };

  return (
    <div className="App" style={{ background: "var(--figma-color-bg)" }}>
      <header>
        <h1>Map Sketcher</h1>
      </header>
      <main>
        <label htmlFor="input">Country name:</label>
        <div>
          <div className="input input--with-icon">
            <div className="icon icon--search"></div>
            <input
              type="text"
              className="input__field"
              placeholder="Country.."
              id="input"
              ref={inputRef}
              onChange={onChange}
              onKeyDown={submitByEnterButton}
            />
            {error && (
              <p className="error" style={{ fontSize: "8px", color: "red" }}>
                Please enter correct country name.
              </p>
            )}
          </div>
        </div>
        {renderList && countriesList && countriesList.length > 0 ? (
          <SearchList
            countries={countriesList}
            inputRef={inputRef}
            onClick={handleCountryClick}
          />
        ) : (
          ""
        )}
        <div>
          {svgContent ? (
            <svg
              viewBox="-20 -20 300 200"
              width="300"
              height="200"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                fill: "lightCoral",
                border: "1px solid black",
              }}
            >
              <path d={`${svgContent}`} />
            </svg>
          ) : countryName.length > 0 && !error ? (
            <p>Loading GeoJSON data...</p>
          ) : (
            ""
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
