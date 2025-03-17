import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import herobgvideo from "../assets/herobgvideo.mp4";
import { useLocation } from 'react-router-dom';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Helper function to split text into individual words wrapped in spans.
 * @param {string} text - The text to split.
 * @returns {JSX.Element[]} - An array of span elements.
 */
const splitWords = (text) => {
  return text.split(" ").map((word, index) => (
    <span key={index} className="word inline-block mr-2 text-white">
      {word}
    </span>
  ));
};

export const Hero = () => {
  const location = useLocation();
  const heroRef = useRef(null);

  useEffect(() => {
    // Don't run the animation if we're on the feedback page
    if (location.pathname === '/feedback') {
      return;
    }

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray(".word");

      gsap.fromTo(
        words,
        { y: 100, opacity: 0 },
        {
          y: 0,
          delay: 0.4,
          opacity: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: "power2.out",
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, [location.pathname]);

  // Don't render the hero section on the feedback page
  if (location.pathname === '/feedback') {
    return null;
  }

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-10 py-5 lg:pt-[5%]"
      ref={heroRef}
    >
      {/* Background Video */}
      <video 
        className="absolute top-0 left-0 w-full h-full object-cover z-[1]"
        src={herobgvideo}
        autoPlay
        loop
        muted
      ></video>
      
      {/* Overlay to make content more readable */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

      {/* Desktop View */}
      <div className="relative z-10 hidden sm:block text-white leading-none">
        <h1
          data-scroll
          data-scroll-speed=".2"
          className="text-[4vw] reg overflow-hidden text-white"
        >
          {splitWords("Tear  Into")}
        </h1>
        <h1
          data-scroll
          data-scroll-speed=".2"
          className="text-[7vw] bold overflow-hidden bg-gradient-to-r from-brand-primary to-purple-600 bg-clip-text text-transparent"
        >
          {splitWords("Better  Performance")}
        </h1>
        <h1
          data-scroll
          data-scroll-speed=".2"
          className="text-[7vw] bold overflow-hidden text-white"
        >
          <sup className="text-[4vw] reg overflow-hidden text-white">
            {splitWords("With")}
          </sup>{""}
          {splitWords("Sharper  Ads")}
        </h1>
        <div 
          data-scroll
          data-scroll-speed="0.3"
          className="mt-8 max-w-4xl  text-left"
        >
          <h2 className="text-3xl font-bold mb-4 shiny-text">
            C.L.A.W - Creative, Layout, & Ad optimization Workbench
          </h2>
          <p className="text-2xl leading-relaxed text-white/90 font-light">
            Like a wolf's claw,<br/>
            it cuts through inefficiencies to deliver stronger, and
            smarter creatives
          </p>
        </div>
      </div>
      
      {/* Mobile View */}
      <div className="relative z-10 block sm:hidden text-white leading-none">
        <h1 className="text-[8vw] reg text-white">{splitWords("Tear  Into")}</h1>
        <h1 className="text-[7vw] bold bg-gradient-to-r from-brand-primary to-purple-600 bg-clip-text text-transparent">
          {splitWords("Better  Performance")}
        </h1>
        <h1 className="text-[8vw] reg text-white">{splitWords("With")}</h1>
        <h1 className="text-[7vw] bold text-white">{splitWords("Sharper  Ads")}</h1>
        <div className="mt-6 max-w-sm ml-auto text-right">
          <h2 className="text-xl text-left font-bold mb-3 text-white">
            CLAW - Creative, Layout, & Ad optimization Workbench
          </h2>
          <p className="text-base text-left leading-relaxed text-white/90 font-light">
            Like a wolf's claw in the wild,
            it cuts through inefficiencies to deliver stronger,
            smarter creatives and copy
          </p>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6 text-white animate-bounce"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
        <p className="text-white text-xl mt-2 font-light tracking-wider">Ready to begin your hunt?</p>
      </div>

      <style jsx>{`
        .shiny-text {
          position: relative;
          display: inline-block;
          color: white;
          background: linear-gradient(
            to right,
            #fffefd 0%,
            #f6f6f6 19%,
            #ffffff 40%,
            #ffffff 50%,
            #ffffff 60%,
            #fffefd 80%,
            #ffffff 200%
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
          animation: shine 4s ease-in-out infinite;
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
        }

        @keyframes shine {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
      `}</style>
    </div>
  );
};

export default Hero;
