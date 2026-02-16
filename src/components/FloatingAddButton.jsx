import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function FloatingAddButton({ onClick }) {
    return (
        <motion.button
            onClick={onClick}
            className="fixed bottom-8 right-6 w-15 h-15 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white  flex items-center justify-center z-30"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <Plus size={28} strokeWidth={2.5} />
        </motion.button>
    );
}
