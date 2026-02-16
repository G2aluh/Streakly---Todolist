import { useEffect, useRef } from 'react';
import { useTodos } from '../hooks/useTodos';
import { useToast } from '../context/ToastContext';

export default function NotificationManager() {
    const { todos } = useTodos();
    const { addToast } = useToast();
    const notifiedRef = useRef(new Set());

    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        const checkNotifications = () => {
            const now = new Date();
            const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            const todayStr = now.toISOString().split('T')[0];

            todos.forEach(todo => {
                if (todo.date === todayStr && todo.time && !todo.is_completed) {
                    const todoTimeShort = todo.time.slice(0, 5); // HH:MM

                    if (todoTimeShort === currentTime && !notifiedRef.current.has(todo.id)) {
                        // Always show in-app toast
                        addToast(`It's time for: ${todo.title}`, 'info');

                        // Show system notification if allowed
                        if (Notification.permission === 'granted') {
                            new Notification('Streakly Reminder 🔔', {
                                body: `It's time for: ${todo.title}`,
                                icon: '/Streakly02.png'
                            });
                        }

                        notifiedRef.current.add(todo.id);
                    }
                }
            });
        };

        const interval = setInterval(checkNotifications, 10000); // Check every 10s
        checkNotifications();

        return () => clearInterval(interval);
    }, [todos]);

    console.log('NotificationManager active, monitoring', todos.length, 'tasks');

    return null;
}
