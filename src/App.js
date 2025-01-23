import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar';
import Content from './Pages/Content';
import Relation from './Pages/Relation';

function App() {
  return (
    <div className="App">
         <Router>
           <Navbar/>
           <Routes>
             <Route path="/" element={<Content/>} />
             <Route path="/relation" element={<Relation/>} />
           </Routes>
         </Router>
    </div>
  );
}

export default App;
