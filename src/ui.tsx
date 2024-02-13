import "./ui.css";
import "../node_modules/figma-plugin-ds/dist/figma-plugin-ds.css";
import { useRef, useState, useEffect, MouseEvent } from "react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import fetch from "node-fetch";
import { SearchList } from "./SearchList";
import { Preview } from "./Preview";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDisabled, setDisabled] = useState(false);
  const [isPreview, setPreview] = useState(false);
  const [figma, setFigma] = useState(false);
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
      return data[0]?.cca3;
    } else {
      setError(true);
      setPreview(false);
      setFigma(false);
      setCountryName("");
      cancelPreview();
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
      //console.log("GeoJSONData:" + JSON.stringify(geojson));
      return geojson;
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
      setPreview(false);
      setFigma(false);
      cancelPreview();
    }
  };

  useEffect(() => {
    if (countryName !== "") {
      fetchData();
    }
  }, [countryName]);

  useEffect(() => {
    if (svgContent && figma) {
      createVectorInFigma(svgContent);
    }
  }, [svgContent, figma]);

  useEffect(() => {
    if (isPreview) {
      sendPreviewToFigma();
    }
  }, [isPreview]);

  const submitByEnterButton = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13 && !isPreview && inputRef.current.value.length > 0) {
      setCountryName(inputRef.current?.value);
      setRenderList(false);
      setPreview(true);
      // sendPreviewToFigma();
    } else if (e.keyCode === 13 && isPreview) {
      setFigma(true);
    }
  };

  const onSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCountryName(inputRef.current?.value);
    if (isPreview) {
      setFigma(true);
    }
  };

  const onPreviewSubmit = () => {
    setCountryName(inputRef.current?.value);
    if (error) {
      setPreview(false);
    }
    setPreview(true);
    //sendPreviewToFigma();
  };

  const createVectorInFigma = async (svgContent: String) => {
    parent.postMessage(
      { pluginMessage: { type: "create-map", svgContent } },
      "*"
    );
  };

  const sendPreviewToFigma = async () => {
    parent.postMessage({ pluginMessage: { type: "preview" } }, "*");
  };

  const cancelPreview = () => {
    parent.postMessage({ pluginMessage: { type: "no-preview" } }, "*");
  };

  const onChange = async () => {
    if (inputRef.current?.value === "") {
      setDisabled(false);
      setRenderList(false);
      setPreview(false);
      setFigma(false);
      cancelPreview();
    } else {
      setDisabled(true);
      setError(false);
      fetchNames(inputRef.current?.value.toLowerCase());
      setRenderList(true);
      if (isPreview && !figma) {
        setCountryName("");
        setPreview(false);
        cancelPreview();
      }
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
    <div className="App">
      <header>
        <h1>Map Sketcher</h1>
        {isPreview ? (
          <p style={{ paddingTop: "10px", fontSize: "12px" }}>Preview</p>
        ) : (
          ""
        )}
      </header>
      <main>
        <div className="first-row">
          <label htmlFor="input">Country name:</label>
          <div
            className="input input--with-icon"
            style={{ marginBottom: "2em", width: "250px" }}
          >
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
          {renderList && countriesList && countriesList.length > 0 ? (
            <SearchList
              countries={countriesList}
              inputRef={inputRef}
              onClick={handleCountryClick}
            />
          ) : (
            ""
          )}
          {isDisabled && !isPreview ? (
            <button
              className="button button--primary"
              onMouseDown={onPreviewSubmit}
            >
              Generete Map
            </button>
          ) : isPreview ? (
            <button className="button button--primary" onMouseDown={onSubmit}>
              Append Vector
            </button>
          ) : (
            <button className="button button--primary" disabled>
              Generete Map
            </button>
          )}
        </div>
        <div className="sec-row">
          {svgContent && isPreview ? (
            <Preview svgContent={svgContent} />
          ) : countryName.length > 0 && !error && isPreview ? (
            <p>Loading GeoJSON data...</p>
          ) : (
            ""
          )}
        </div>
      </main>
      <footer></footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
