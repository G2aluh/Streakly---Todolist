import { useEffect, useRef } from 'react';
import { useTodos } from '../hooks/useTodos';

export default function NotificationManager() {
    const { todos } = useTodos();
    const notifiedRef = useRef(new Set());

    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        const checkNotifications = () => {
            if (Notification.permission !== 'granted') return;

            const now = new Date();
            const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            const todayStr = now.toISOString().split('T')[0];

            todos.forEach(todo => {
                if (todo.date === todayStr && todo.time && !todo.is_completed) {
                    const todoTimeShort = todo.time.slice(0, 5); // HH:MM

                    if (todoTimeShort === currentTime && !notifiedRef.current.has(todo.id)) {
                        new Notification('Streakly Reminder 🔔', {
                            body: `It's time for: ${todo.title}`,
                            icon: '/Streakly.png'
                        });
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
