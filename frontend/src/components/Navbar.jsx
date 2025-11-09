import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Dashboard", path: "/" },
    { name: "Image OCR", path: "/ocr" },
    { name: "Movie Recommender", path: "/movie" },
    { name: "Text Generator", path: "/text" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#0a0f1f]/70 to-[#1a2238]/70 backdrop-blur-md shadow-lg border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo / Brand Name */}
        <Link
          to="/"
          className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-2xl font-extrabold tracking-wide hover:drop-shadow-[0_0_12px_rgba(0,153,255,0.7)] transition-all duration-300"
        >
          AI<span className="text-white">Hub</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative text-white font-medium transition-all duration-300 ${
                  active ? "text-cyan-400" : "text-gray-300"
                }`}
              >
                <span className="relative group">
                  {link.name}
                  <span
                    className={`absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full transition-all duration-300 group-hover:w-full`}
                  ></span>
                </span>

                {/* Hover glow */}
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 opacity-0 hover:opacity-100 drop-shadow-[0_0_15px_rgba(0,153,255,0.5)]"
                ></motion.span>
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Icon */}
        <div
          className="md:hidden text-white text-2xl cursor-pointer hover:drop-shadow-[0_0_10px_rgba(0,153,255,0.8)] transition-all duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-[#0a0f1f]/95 border-t border-white/10 backdrop-blur-md"
        >
          <div className="flex flex-col items-center space-y-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-semibold transition-all duration-300 ${
                  location.pathname === link.path
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,153,255,0.7)]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
