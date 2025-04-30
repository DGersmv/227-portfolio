import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const projects = [
  {
    title: "Prefab Module Planner",
    description: "Grasshopper tool for generating modular layouts.",
    image: "https://via.placeholder.com/600x300?text=Prefab+Module+Planner",
    link: "/projects/prefab"
  },
  {
    title: "Archicad Plugin Suite",
    description: "Automation tools for exporting geometry and metadata.",
    image: "https://via.placeholder.com/600x300?text=Archicad+Plugins",
    link: "/projects/plugin"
  },
  {
    title: "Android Field App",
    description: "Photo reporting app for construction, linked to WordPress.",
    image: "https://via.placeholder.com/600x300?text=Field+App",
    link: "/projects/android"
  },
  {
    title: "Unreal Scenes",
    description: "Interactive architectural visualizations.",
    image: "https://via.placeholder.com/600x300?text=Unreal+Scenes",
    link: "/projects/unreal"
  },
  {
    title: "country-house.online",
    description: "Site management and visualization platform.",
    image: "https://via.placeholder.com/600x300?text=Country+House",
    link: "/projects/country-house"
  }
];

export default function Projects({ title, lang, moreDetails }) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      {projects.length === 0 ? (
        <p className="text-gray-300">No projects available.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, idx) => (
            <motion.article
              key={idx}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-40 object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/600x300?text=Image+Not+Found";
                }}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-white">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                <Link
                  to={project.link}
                  className="inline-block bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm px-4 py-2 rounded-full hover:from-blue-700 hover:to-blue-600 transition-all duration-200"
                  aria-label={`Learn more about ${project.title}`}
                >
                  {moreDetails}
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </section>
  );
}