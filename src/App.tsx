import "./App.css";
import InputList from "./components/InputList.tsx";
import Shortcut from "./components/Shortcut.tsx";
import { Divider } from "antd";
import Config from "./components/Config.tsx";

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
