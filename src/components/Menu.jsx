import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Menu({ lang, translations }) {
    const location = useLocation();

    const links = [
        { path: "/", label: translations.about },
        { path: "/projects/architecture", label: translations.archiveArchitecture },
        { path: "/projects/landscape", label: translations.archiveLandscape },
        { path: "/projects/archicad-grasshopper", label: translations.archicadGrasshopper },
        { path: "/projects/archicad-plugins", label: translations.archicadPlugins },
        { path: "/projects/revit-plugins", label: translations.revitPlugins },
        { path: "/projects/android", label: translations.androidApp },
        { path: "/projects/web", label: translations.webDev },
        { path: "/projects/dashboard", label: translations.dashboard },
        { path: "/projects/visualization", label: translations.visualization },
        { path: "/projects/unreal", label: translations.unreal },
    ];

    return (
        <nav className="mb-12 relative">
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 py-4 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-xl px-6">
                {links.map((link, idx) => (
                    <motion.div
                        key={link.path}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.1, type: "spring", stiffness: 100 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            to={link.path}
                            className={`relative px-5 py-2 rounded-lg text-base font-medium transition-all duration-300 ease-in-out ${location.pathname === link.path
                                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/40'
                                    : 'bg-gray-900 text-gray-200 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:text-white hover:shadow-lg hover:shadow-purple-600/30'
                                }`}
                        >
                            <span className="relative z-10">{link.label}</span>
                            {location.pathname === link.path && (
                                <motion.div
                                    className="absolute inset-0 rounded-lg bg-purple-500/20 blur-lg"
                                    layoutId="particle-glow"
                                    initial={false}
                                    transition={{ duration: 0.4 }}
                                />
                            )}
                        </Link>
                    </motion.div>
                ))}
            </div>
        </nav>
    );
}
