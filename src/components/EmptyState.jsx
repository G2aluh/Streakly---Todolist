import { motion } from 'framer-motion';
import { ListChecks, Sparkles } from 'lucide-react';

export default function EmptyState() {
    return (
        <motion.div
            className="flex flex-col items-center justify-center py-20 px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <div className="relative mb-6">
                <div className="w-24 h-24 rounded-3xl bg-amber-50 flex items-center justify-center">
                    <ListChecks size={44} className="text-amber-300" />
                </div>
                <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center"
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                    <Sparkles size={16} className="text-orange-400" />
                </motion.div>
            </div>
            <h3 className="text-lg font-bold text-stone-700 mb-1.5">
                No tasks yet
            </h3>
            <p className="text-sm text-stone-400 text-center max-w-[260px] leading-relaxed">
                Start building your streak! Tap the <span className="font-semibold text-amber-500">+</span> button to add your first task.
            </p>
        </motion.div>
    );
}
