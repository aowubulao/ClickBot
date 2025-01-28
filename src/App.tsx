import "./App.css";
import InputList from "./components/InputList.tsx";
import Shortcut from "./components/Shortcut.tsx";
import { Divider } from "antd";

function App() {
  return (
    <>
      <main className="container">
        <Shortcut />
        <Divider />
        <InputList />
      </main>
    </>
  );
}

export default App;
