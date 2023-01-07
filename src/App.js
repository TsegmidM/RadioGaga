import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RadioGaga from './components';
import MyMap from './components/map';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route index element={<RadioGaga/>}/>
          {/* <Route path=':map' element={<MyMap/>}/> */}
    

      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
