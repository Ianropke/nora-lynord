import { motion, AnimatePresence } from "framer-motion";

interface CorrectFeedbackProps {
  show: boolean;
  word?: string;
}

/**
 * Big, satisfying full-screen feedback overlay when the child picks the correct answer.
 * Shows a green flash, the word, a big checkmark, and stars.
 */
export function CorrectFeedback({ show, word }: CorrectFeedbackProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          {/* Green flash overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-green-400"
          />

          {/* Central burst */}
          <div className="relative flex flex-col items-center gap-2">
            {/* Expanding ring */}
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute w-32 h-32 rounded-full border-8 border-green-400"
            />

            {/* Big checkmark circle */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
                className="text-white text-6xl font-black"
              >
                ✓
              </motion.span>
            </motion.div>

            {/* "RIGTIGT!" text */}
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="bg-green-500 text-white font-black text-3xl px-8 py-3 rounded-2xl shadow-xl shadow-green-500/40 mt-2"
            >
              RIGTIGT! 🌟
            </motion.div>

            {/* Show the word they got right */}
            {word && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="bg-white text-gray-800 font-black text-2xl px-6 py-2 rounded-xl shadow-lg mt-1"
              >
                {word}
              </motion.div>
            )}

            {/* Floating stars */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{
                  x: (i % 2 === 0 ? 1 : -1) * (40 + Math.random() * 60),
                  y: -60 - Math.random() * 80,
                  opacity: 0,
                  scale: 1.5,
                }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.8 }}
                className="absolute text-3xl"
                style={{ top: "30%", left: `${40 + i * 4}%` }}
              >
                ⭐
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
