import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Flame } from 'lucide-react';

export default function RegisterPage() {
    const { user, signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (user) return <Navigate to="/" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await signUp(email, password);
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6">
            <motion.div
                className="w-full max-w-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center  mb-4">
                        <Flame className="text-white" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-stone-800">Create Account</h1>
                    <p className="text-sm text-stone-400 mt-1">
                        Join Streakly and start your streak
                    </p>
                </div>

                {success ? (
                    <motion.div
                        className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <p className="text-emerald-700 font-semibold mb-1">
                            Account created! 🎉
                        </p>
                        <p className="text-emerald-600 text-sm">
                            Check your email to verify your account, then{' '}
                            <Link
                                to="/login"
                                className="font-bold underline hover:text-emerald-800"
                            >
                                sign in
                            </Link>
                            .
                        </p>
                    </motion.div>
                ) : (
                    <>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 rounded-xl bg-red-50 text-red-500 text-sm font-medium text-center">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-stone-600 mb-1.5">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-800 placeholder-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-600 mb-1.5">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min. 6 characters"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-800 placeholder-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-600 mb-1.5">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-800 placeholder-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-white font-semibold text-sm hover:shadow-amber-300/50 active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>

                        <p className="text-center text-sm text-stone-400 mt-6">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-amber-500 font-semibold hover:text-amber-600 transition-colors"
                            >
                                Sign In
                            </Link>
                        </p>
                    </>
                )}
            </motion.div>
        </div>
    );
}
