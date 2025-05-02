
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <MapPin className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-green-800 dark:text-green-400">GreenRoute</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex space-x-4">
                <Link 
                  to="/" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-green-700 hover:text-green-900 hover:bg-green-100 dark:text-green-400 dark:hover:text-white dark:hover:bg-green-800"
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-green-700 hover:text-green-900 hover:bg-green-100 dark:text-green-400 dark:hover:text-white dark:hover:bg-green-800"
                >
                  About
                </Link>
                <Link 
                  to="/dashboard" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-green-700 hover:text-green-900 hover:bg-green-100 dark:text-green-400 dark:hover:text-white dark:hover:bg-green-800"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button className="px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Sign In
              </button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button className="bg-green-100 dark:bg-green-900 inline-flex items-center justify-center p-2 rounded-md text-green-700 dark:text-green-400 hover:text-green-900 hover:bg-green-200 dark:hover:text-white dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
