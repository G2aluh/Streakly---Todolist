import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

export default function AddTodoModal({ isOpen, onClose, onAdd }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Title is required');
            return;
        }
        if (!date) {
            setError('Date is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onAdd(title.trim(), description.trim(), date);
            setTitle('');
            setDescription('');
            setDate(format(new Date(), 'yyyy-MM-dd'));
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed inset-x-0 bottom-0 z-50 flex justify-center"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                    >
                        <div className="w-full max-w-lg bg-white rounded-t-3xl shadow-2xl">
                            {/* Handle */}
                            <div className="flex justify-center pt-3 pb-1">
                                <div className="w-10 h-1.5 rounded-full bg-stone-200" />
                            </div>

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                                        <CalendarDays size={16} className="text-amber-500" />
                                    </div>
                                    <h2 className="text-lg font-bold text-stone-800">
                                        New Task
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="px-6 pb-8 space-y-4">
                                {error && (
                                    <div className="p-3.5 rounded-2xl bg-red-50 text-red-500 text-sm font-medium text-center">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                                        Title <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="What do you need to do?"
                                        className="w-full px-4 py-3.5 rounded-2xl border border-stone-200 bg-stone-50 text-stone-800 placeholder-stone-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Add some details (optional)"
                                        rows={3}
                                        className="w-full px-4 py-3.5 rounded-2xl border border-stone-200 bg-stone-50 text-stone-800 placeholder-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                                        Date <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <CalendarDays size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none" />
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-stone-200 bg-stone-50 text-stone-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold text-sm hover:shadow-amber-300/50 active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Adding...' : 'Add Task'}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
