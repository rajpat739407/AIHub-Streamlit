import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ModelCard = ({ title, description, image, route, accent }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/40"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-75 transition-all duration-500 hover:brightness-90"
        style={{ backgroundImage: `url(${image})` }}
      ></div>

      {/* Frosted glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent backdrop-blur-sm"></div>

      {/* Text content */}
      <div className="relative z-10 p-6 flex flex-col justify-end h-full text-white">
        <h2
          className="text-2xl font-bold mb-2 drop-shadow-lg"
          style={{ color: accent }}
        >
          {title}
        </h2>
        <p className="text-gray-200 mb-4 text-sm">{description}</p>

        <Link
          to={route}
          className={`inline-block w-fit px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 shadow-md hover:shadow-[0_0_15px_${accent}]`}
          style={{
            backgroundColor: accent,
            boxShadow: `0 0 12px ${accent}`,
          }}
        >
          Explore →
        </Link>
      </div>

      {/* Glow outline */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 hover:opacity-100 transition duration-500"
        style={{
          boxShadow: `0 0 30px 3px ${accent}`,
        }}
      ></div>
    </motion.div>
  );
};

export default ModelCard;
