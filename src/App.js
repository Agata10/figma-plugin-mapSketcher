import "./App.css";
import "../node_modules/figma-plugin-ds/dist/figma-plugin-ds.css";
function App() {
  return (
    <div className="App" style={{ background: "var(--figma-color-bg)" }}>
      <header>
        <h1>Map sketcher</h1>
      </header>
      <main>
        <div class="input input--with-icon">
          <div class="icon icon--search"></div>
          <label htmlFor="input">Country name:</label>
          <input
            type="text"
            class="input__field"
            value="Value"
            placeholder="Country.."
            id="input"
          />
        </div>
      </main>
      <footer>
        <button class="button button--primary">Label</button>
      </footer>
    </div>
  );
}

export default App;
