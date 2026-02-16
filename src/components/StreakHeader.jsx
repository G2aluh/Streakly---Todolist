import { motion, AnimatePresence } from 'framer-motion';
import { Flame, LogOut, Zap, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function StreakHeader({ currentStreak, bestStreak, celebrateStreak }) {
    const { user, signOut } = useAuth();

    const displayName = user?.email?.split('@')[0] || 'User';

    return (
        <header className="px-5 pt-6 pb-2">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center ">
                        <Zap className="text-white" size={18} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-stone-800">Home</h1>
                    </div>
                </div>
                <button
                    onClick={signOut}
                    className="p-2.5 rounded-full bg-stone-100 text-stone-400 hover:text-stone-600 hover:bg-stone-200 transition-colors"
                    title="Sign out"
                >
                    <LogOut size={18} />
                </button>
            </div>

            {/* Streak Card */}
            <motion.div
                className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 to-orange-400 p-5 "
                layout
            >
                <AnimatePresence>
                    {celebrateStreak && (
                        <motion.div
                            className="absolute inset-0 bg-white/20"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                        />
                    )}
                </AnimatePresence>

                {/* Decorative circles */}
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
                <div className="absolute -bottom-4 -right-2 w-16 h-16 rounded-full bg-white/10" />

                <div className="relative flex items-center gap-4">
                    <motion.div
                        className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm"
                        animate={
                            celebrateStreak
                                ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }
                                : {}
                        }
                        transition={{ duration: 0.5 }}
                    >
                        <Flame className="text-white" size={32} />
                    </motion.div>

                    <div className="relative flex-1">
                        <motion.p
                            className="text-4xl font-extrabold text-white"
                            key={currentStreak}
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            {currentStreak}
                            <span className="text-lg font-semibold ml-1 text-white/80">
                                days
                            </span>
                        </motion.p>
                        <p className="text-sm font-medium text-white/80 mt-0.5">
                            Current streak
                        </p>
                    </div>

                    {celebrateStreak && (
                        <motion.span
                            className="absolute right-0 top-0 text-2xl"
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                        >
                            🎉
                        </motion.span>
                    )}
                </div>

                <p className="relative text-xs text-white/70 mt-3">
                    Welcome back, <span className="font-semibold text-white/90 capitalize">{displayName}</span>
                </p>
            </motion.div>

            {/* Best Streak Badge */}
            <div className="flex items-center gap-2.5 mt-3 px-1">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-100">
                    <Trophy size={15} className="text-amber-500" />
                    <span className="text-xs font-bold text-amber-600">
                        Best: {bestStreak} {bestStreak === 1 ? 'day' : 'days'}
                    </span>
                </div>
            </div>
        </header>
    );
}
