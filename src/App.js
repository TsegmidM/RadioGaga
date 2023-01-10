import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RadioGaga from "./components";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<RadioGaga/>}/>
          {/* <Route exact path="search" element={<RadioGaga/>}/> */}
          <Route path=":radioId" element={<RadioGaga/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
