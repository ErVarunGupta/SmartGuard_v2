import React from "react";
import { motion } from "framer-motion";

const MetricCard = ({ title, value, color }) => {
  return (
    <motion.div
      className="metric-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      style={{
        borderLeft: `4px solid ${color}`,
      }}
    >
      <h4>{title}</h4>
      <h2>{value}%</h2>
    </motion.div>
  );
};

export default MetricCard;