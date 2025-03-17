import React from 'react';
import Logo from "../assets/footer-logo.png"

const Footer = () => {
  return (
    <div className='footer reg text-white py-14'>
        <div className='w-full sm:w-10/12 mx-auto'>
        <div className='flex items-center justify-between w-full px-10 sm:px-0'>
            {/* <div className='flex flex-col sm:flex-row items-center gap-y-2 gap-x-6 text-sm'>
                <p>Work</p>
                <p>About</p>
                <p>Career</p>
                <p>Contact</p>
            </div> */}
          
          <div className="flex flex-col xl:flex-row items-center gap-y-4 gap-x-20 text-sm">
    <a 
        href="https://pages.howl.in/work/" 
        target='_blank'
        className="hover:text-gray-600  transition-colors duration-200"
    >
        Work
    </a>
    <a 
        href="https://pages.howl.in/about/" 
        target='_blank'
        className="hover:text-gray-600 transition-colors duration-200"
    >
        About
    </a>
    <a 
        href="https://pages.howl.in/careers/" 
        target='_blank'
        className="hover:text-gray-600 transition-colors duration-200"
    >
        Careers
    </a>
    <a 
        href="https://pages.howl.in/contact/" 
        target='_blank'
        className="hover:text-gray-600 transition-colors duration-200"
    >
        Contact
    </a>
</div>


            {/* <div className='flex flex-col sm:flex-row items-center gap-y-2 gap-x-6 xl:gap-x-10 text-sm'>
                <p>Linkedin</p>
                <p>X</p>
                <p>Instagram</p>
                <p>Youtube</p>
            </div> */}
               <div className="flex flex-col min-[1025px]:flex-row items-center gap-y-4 gap-x-6 xl:gap-x-10 text-sm">
    <a 
        href="https://www.linkedin.com/company/howlhq" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="hover:text-gray-600 transition-colors duration-200"
    >
        LinkedIn
    </a>
    <a 
        href="https://x.com/howlhqwastaken/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="hover:text-gray-400 transition-colors duration-200"
    >
        X
    </a>
    <a 
        href="https://www.instagram.com/howlhq/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="hover:text-gray-500 transition-colors duration-200"
    >
        Instagram
    </a>
    <a 
        href="https://www.youtube.com/@howldigital" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="hover:text-gray-600 transition-colors duration-200"
    >
        YouTube
    </a>
</div>


        </div> 
        <div className='flex flex-col sm:flex-row items-end justify-between px-10 sm:px-0 mt-10 gap-y-10 sm:gap-x-10 lg:gap-x-16 2xl:gap-x-28'>
            {/* <div className='w-full sm:w-1/2 sm:order-2 sm:mt-10 sm:mb-7'>
                <p className='text-sm reg flex'>Get updates for startup news and trends</p>
                <input type='text' className='w-full  py-3 pl-4 mt-2 bg-transparent rounded-lg border-2 border-white placeholder-white' placeholder='Email'/>
            </div> */}
            <div className='xl:w-1/2 mx-auto'>
            <img src={Logo} className='w-full'/>
            <p className='text-sm mt-3 reg text-white'>All rights reserved Designed, developed & powered by HOWL Digital Agency</p>
            </div>
        </div>
        </div>
    </div>
  )
}

export default Footer