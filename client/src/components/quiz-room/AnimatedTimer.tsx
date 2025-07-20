import { motion, AnimatePresence } from "framer-motion";

interface AnimatedTimerProps {
  seconds: number | null;
  hasEnded: boolean;
}

export default function AnimatedTimer({ seconds, hasEnded }: AnimatedTimerProps) {
  return (
    <div className="text-center mt-3">
      <AnimatePresence>
        {!hasEnded && seconds !== null ? (
          <motion.div
            key={seconds}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="display-6 fw-bold bg-warning text-dark rounded-circle d-inline-block px-2 py-2 shadow"
            style={{ minWidth: 70 }}
          >
            {seconds}
          </motion.div>
        ) : hasEnded ? (
          <motion.div
            key="ended"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="display-6 fw-bold text-danger mt-2"
          >
            ⏰ Time is ended!
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
