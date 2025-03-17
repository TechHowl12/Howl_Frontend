import React, { useState, useEffect } from "react";
import Logo from "../assets/logo-nav.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const Refresh = () => {
    window.location.reload();
  };

  // Add scroll effect
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > 50) {
  //       setScrolled(true);
  //     } else {
  //       setScrolled(false);
  //     }
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  // State to manage header visibility based on scroll
  const [isVisible, setIsVisible] = useState(true);
  
  // State to track the last scroll position
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // State to track which link is currently hovered
  const [hoveredLink, setHoveredLink] = useState(null);

  // Effect to handle header visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false); // Hide header on scroll down
      } else {
        setIsVisible(true); // Show header on scroll up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    
    // Cleanup on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Navbar */}
      <nav className={`bg-transparent fixed pt-6 px-2 sm:pt-6 xl:pt-10 top-0 left-0 w-full z-50 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src={Logo} alt="Logo" className="h-10 w-auto" />
              <span className="text-2xl mt-5 font-bold text-white">
                CLAW
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {/* <Link
                to="/"
                onMouseEnter={() => setHoveredLink('Content')}
                onMouseLeave={() => setHoveredLink(null)}
                className={`text-white hover:text-brand-primary font-medium transition-all duration-300 text-lg ${
                  hoveredLink === 'Content' ? 'scale-x-110' : hoveredLink ? 'opacity-30' : ''
                }`}
              >
                Content
              </Link> */}
              {/* <Link
                to="/relation"
                onMouseEnter={() => setHoveredLink('Performance')}
                onMouseLeave={() => setHoveredLink(null)}
                className={`text-white hover:text-brand-primary font-medium transition-all duration-300 text-lg ${
                  hoveredLink === 'Performance' ? 'scale-x-110' : hoveredLink ? 'opacity-30' : ''
                }`}
              >
                Performance
              </Link> */}
              {/* <Link
                to="/feedback"
                onMouseEnter={() => setHoveredLink('Feedback')}
                onMouseLeave={() => setHoveredLink(null)}
                className={`text-white hover:text-brand-primary font-medium transition-all duration-300 text-lg ${
                  hoveredLink === 'Feedback' ? 'scale-x-110' : hoveredLink ? 'opacity-30' : ''
                }`}
              >
                Feedback
              </Link> */}
              {/* <button 
                onClick={Refresh} 
                className="btn-primary flex items-center space-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button> */}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center">
              {/* <button
                onClick={Refresh}
                className="btn-primary mr-4 text-sm py-2 px-3 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button> */}
              {/* <button
                className="text-brand-primary focus:outline-none"
                onClick={toggleMenu}
              >
                <div className="space-y-1.5">
                  <span
                    className={`block w-6 h-0.5 bg-brand-primary transform transition-transform duration-300 ${
                      menuOpen ? "rotate-45 translate-y-2" : ""
                    }`}
                  ></span>
                  <span
                    className={`block w-6 h-0.5 bg-brand-primary transition-opacity duration-300 ${
                      menuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  ></span>
                  <span
                    className={`block w-6 h-0.5 bg-brand-primary transform transition-transform duration-300 ${
                      menuOpen ? "-rotate-45 -translate-y-2" : ""
                    }`}
                  ></span>
                </div>
              </button> */}
            </div>
          </div>
        </div>
      </nav>

      {/* Side Menu */}
      <div
        className={`fixed z-40 top-0 right-0 h-full w-72  shadow-2xl transition-transform transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="pt-24 px-8">
          <ul onClick={toggleMenu}  className="space-y-6 cursor-pointer flex flex-col">
            <Link to='/' className="flex items-center  space-x-2 text-lg text-brand-text hover:text-brand-primary transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Content</span>
            </Link>
            <Link to='/relation' className="flex items-center space-x-2 text-lg text-brand-text hover:text-brand-primary transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>Performance</span>
            </Link>
            <Link to='/feedback' className="flex items-center space-x-2 text-lg text-brand-text hover:text-brand-primary transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span>Feedback</span>
            </Link>
          </ul>
        </div>
      </div>

      {/* Dark overlay when menu is open */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMenu}
        ></div>
      )}

      <style jsx>{`
        .group:hover ~ .group {
          opacity: 0.5;
          transition: opacity 0.3s ease-in-out;
        }
        .group:hover {
          opacity: 1;
          transition: opacity 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;
