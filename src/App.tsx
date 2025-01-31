import "./App.css";
import Shortcut from "./components/shortcut.tsx";
import { Divider } from "antd";
import Config from "./components/config.tsx";
import InputList from "./components/inputList.tsx";

function App() {
  return (
    <>
      <main className="container">
        <Shortcut />
        <Config />
        <Divider />
        <InputList />
      </main>
    </>
  );
}

export default App;
