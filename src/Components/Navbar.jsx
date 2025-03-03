import React, { useState } from "react";
import Logo from "../assets/logo-nav.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const Refresh = () => {
    window.location.reload()
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed w-full bg-slate-600 top-0 z-50">
        <div className="flex justify-between items-center px-8 py-4">
          {/* Logo */}
          <div className="text-2xl font-bold text-gray-700">
            <img src={Logo}/>
          </div>

          {/* Hamburger Menu */}
          <div>
             <button onClick={Refresh} className="bg-slate-300 rounded-md px-4 text-sm mr-4 sm:mr-10 py-1">Refresh</button>
          <button
            className="text-white focus:outline-none"
            onClick={toggleMenu}
          >
            <div className="space-y-1">
              <span
                className={`block w-6 h-0.5 bg-white transform transition-transform ${
                  menuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-white transition-opacity ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-white transform transition-transform ${
                  menuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              ></span>
            </div>
          </button>
          </div>
        </div>
      </nav>

      {/* Side Menu */}
      <div
        className={`fixed z-10 top-0 right-0 h-full w-64 bg-gray-50 shadow-lg transition-transform transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="pt-24 px-5">
          <ul onClick={toggleMenu} className="space-y-4 cursor-pointer flex flex-col">
            <Link to='/' className="text-2xl text-slate-700">Content</Link>
            <Link to='/relation' className="text-2xl text-slate-700">Performance</Link>
            <Link to='/feedback' className="text-2xl text-slate-700">Feedback</Link>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
