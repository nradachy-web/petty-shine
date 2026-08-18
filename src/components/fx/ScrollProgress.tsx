"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A red rule that draws across the bottom of the sticky header as you read,
 * the site's signature motif doing quiet work as a progress indicator.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 28,
    mass: 0.4,
  });
  return (
    <motion.div
      aria-hidden
      className="absolute bottom-[-1px] left-0 right-0 h-[2px] origin-left bg-red"
      style={{ scaleX }}
    />
  );
}
