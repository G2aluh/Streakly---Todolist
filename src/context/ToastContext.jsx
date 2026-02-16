import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, AlertCircle } from 'lucide-react';

const ToastContext = createContext();

export function useToast() {
    return useContext(ToastContext);
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            layout
                            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border w-80 backdrop-blur-md ${toast.type === 'error'
                                    ? 'bg-red-50/90 border-red-100 text-red-800'
                                    : 'bg-white/90 border-stone-200 text-stone-800'
                                }`}
                        >
                            <div className={`mt-0.5 ${toast.type === 'error' ? 'text-red-500' : 'text-amber-500'}`}>
                                {toast.type === 'error' ? <AlertCircle size={18} /> : <Bell size={18} />}
                            </div>
                            <div className="flex-1 text-sm font-medium leading-relaxed">
                                {toast.message}
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-stone-400 hover:text-stone-600 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
