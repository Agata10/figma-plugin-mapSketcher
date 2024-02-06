import "./App.css";
import "../node_modules/figma-plugin-ds/dist/figma-plugin-ds.css";
import { useRef, useState, useEffect } from "react";
function App() {
  const inputRef = useRef(null);
  const [isDisabled, setDisabled] = useState(false);
  const [countryName, setCountryName] = useState("");
  const [countryISO, setCountryISO] = useState("");
  const [geoJSON, setGeoJSON] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${countryName}`
      );
      const data = await response.json();
      if (data[0]?.cca3) {
        setCountryISO(data[0]?.cca3);
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
        setGeoJSON(dataGeo?.simplifiedGeometryGeoJSON);
        console.log(dataGeo);
      } else {
        throw new Error("No GeoJson for country found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (countryISO) {
      fetchGeo();
    }
  }, [countryISO]);

  const onSubmit = async (e) => {
    e.preventDefault();
    await fetchData();
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
        <h1>Map sketcher</h1>
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

export default App;
