import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar';
import Content from './Pages/Content';
import Relation from './Pages/Relation';
import Feedback from './Pages/Feedback';

function App() {
  return (
    <div className="App">
         <Router>
           <Navbar/>
           <Routes>
             <Route path="/" element={<Content/>} />
             <Route path="/relation" element={<Relation/>} />
              <Route path="/feedback999" element={<Feedback/>} />
           </Routes>
         </Router>
    </div>
  );
}

export default App;
