import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar';
import { Hero } from './Components/Hero';
import Content from './Pages/Content';
import Relation from './Pages/Relation';
import Feedback from './Pages/Feedback';
import { useEffect } from 'react';
import Footer from './Components/Footer';

function App() {
  // Add a scroll-to-top effect when changing routes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="App min-h-screen bg-brand-background">
      <Router>
        <Navbar/>
        <Hero/>
        <div className="relative">
          <Routes>
            <Route path="/" element={<Content/>} />
            <Route path="/relation" element={<Relation/>} />
            <Route path="/feedback" element={<Feedback/>} />
          </Routes>
        </div>
      </Router>
      <Footer/>
    </div>
  );
}

export default App;
