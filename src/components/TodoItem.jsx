import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';

// Pastel background colors for todo cards (amber/warm palette)
const CARD_COLORS = [
    'bg-amber-50 border-amber-100',
    'bg-orange-50 border-orange-100',
    'bg-yellow-50 border-yellow-100',
    'bg-rose-50 border-rose-100',
    'bg-stone-100 border-stone-200',
    'bg-lime-50 border-lime-100',
];

// Emoji icons for visual variety
const CARD_EMOJIS = ['🎯', '📝', '⭐', '🔥', '💪', '✨', '📌', '🚀', '💡', '🏆'];

function getCardColor(index) {
    return CARD_COLORS[index % CARD_COLORS.length];
}

function getCardEmoji(title) {
    // Generate a consistent emoji based on title
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    return CARD_EMOJIS[Math.abs(hash) % CARD_EMOJIS.length];
}

export default function TodoItem({ todo, onToggle, onDelete, index = 0 }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        setTimeout(() => onDelete(todo.id), 300);
    };

    const colorClass = todo.is_completed
        ? 'bg-stone-50 border-stone-100'
        : getCardColor(index);
    const emoji = getCardEmoji(todo.title);

    return (
        <AnimatePresence>
            {!isDeleting && (
                <motion.div
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -60, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className={`flex items-center gap-3.5 p-4 rounded-2xl border transition-all ${colorClass}`}
                >
                    {/* Emoji Icon */}
                    <div
                        className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-lg ${todo.is_completed ? 'bg-stone-100 opacity-50' : 'bg-white/70'
                            }`}
                    >
                        {emoji}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <p
                            className={`text-sm font-semibold leading-snug transition-colors ${todo.is_completed
                                    ? 'text-stone-400 line-through'
                                    : 'text-stone-700'
                                }`}
                        >
                            {todo.title}
                        </p>
                        {todo.description && (
                            <p
                                className={`text-xs mt-0.5 leading-relaxed ${todo.is_completed ? 'text-stone-300' : 'text-stone-400'
                                    }`}
                            >
                                {todo.description}
                            </p>
                        )}
                    </div>

                    {/* Checkbox */}
                    <button
                        onClick={() => onToggle(todo.id, todo.is_completed)}
                        className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${todo.is_completed
                                ? 'bg-emerald-400 border-emerald-400'
                                : 'border-stone-300 hover:border-amber-400 bg-white'
                            }`}
                    >
                        <AnimatePresence>
                            {todo.is_completed && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                >
                                    <Check size={14} className="text-white" strokeWidth={3} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Delete */}
                    <button
                        onClick={handleDelete}
                        className="flex-shrink-0 p-1 rounded-lg text-stone-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 size={14} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
