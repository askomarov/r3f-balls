import "./App.css";
import AppCanvas from "./components/Canvas.tsx";

const App = () => {
  return (
    <>
      <header>
        <div className="container">header</div>
      </header>
      <main>
        <div className="container">
          main
          <AppCanvas></AppCanvas>
        </div>
      </main>
      <footer className="container">footer</footer>
    </>
  );
};

export default App;
