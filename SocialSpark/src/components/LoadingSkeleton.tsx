import { motion } from 'framer-motion';

export default function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 w-full">
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          className="w-10 h-10 bg-gray-200 rounded-full"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <div className="space-y-2">
          <motion.div
            className="h-4 w-24 bg-gray-200 rounded"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="h-3 w-16 bg-gray-200 rounded"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <motion.div
          className="h-4 w-full bg-gray-200 rounded"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="h-4 w-3/4 bg-gray-200 rounded"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
      <motion.div
        className="h-48 w-full bg-gray-200 rounded-lg mb-4"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <div className="flex gap-6">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-6 w-12 bg-gray-200 rounded"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  );
}