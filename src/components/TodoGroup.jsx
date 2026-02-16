import { motion } from 'framer-motion';
import TodoItem from './TodoItem';
import { CheckCircle } from 'lucide-react';

export default function TodoGroup({ group, onToggle, onDelete }) {
    const progressPercent =
        group.totalCount > 0
            ? Math.round((group.completedCount / group.totalCount) * 100)
            : 0;

    // Separate completed and pending items
    const pendingItems = group.items.filter((t) => !t.is_completed);
    const completedItems = group.items.filter((t) => t.is_completed);

    return (
        <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Group Header */}
            <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-sm font-bold text-stone-600 uppercase tracking-wider">
                    {group.label}
                </h2>
                <div className="flex items-center gap-2">
                    {group.isFullyCompleted && (
                        <CheckCircle size={16} className="text-emerald-400" />
                    )}
                    <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${group.isFullyCompleted
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'bg-amber-100 text-amber-600'
                            }`}
                    >
                        {group.completedCount}/{group.totalCount}
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-stone-100 rounded-full mb-4 mx-1 overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${group.isFullyCompleted
                            ? 'bg-emerald-400'
                            : 'bg-amber-400'
                        }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                />
            </div>

            {/* Pending Items */}
            {pendingItems.length > 0 && (
                <div className="space-y-2.5">
                    {pendingItems.map((todo, idx) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            index={idx}
                            onToggle={onToggle}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}

            {/* Completed Section */}
            {completedItems.length > 0 && (
                <div className="mt-4">
                    {pendingItems.length > 0 && (
                        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2.5 px-1">
                            Completed
                        </p>
                    )}
                    <div className="space-y-2">
                        {completedItems.map((todo, idx) => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                index={idx}
                                onToggle={onToggle}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
