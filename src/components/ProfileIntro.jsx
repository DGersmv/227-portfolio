// components/ProfileIntro.jsx
import React from "react";
import { motion } from "framer-motion";

export default function ProfileIntro({ name, role }) {
  return (
    <motion.div
  className="" // либо вообще без класса
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>

      <h1 className="text-3xl md:text-4xl font-bold">{name}</h1>
      <p className="text-gray-400 mt-1 text-base md:text-lg">{role}</p>
    </motion.div>
  );
}
