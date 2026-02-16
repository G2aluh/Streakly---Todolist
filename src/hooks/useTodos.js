import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { format, isToday, isYesterday, parseISO } from 'date-fns';

export function useTodos() {
    const { user } = useAuth();
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTodos = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: true })
            .order('created_at', { ascending: true });

        if (!error) setTodos(data || []);
        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    const addTodo = async (title, description, date, time) => {
        const { data, error } = await supabase
            .from('todos')
            .insert({
                user_id: user.id,
                title,
                description: description || null,
                date,
                time: time || null,
                is_completed: false,
            })
            .select()
            .single();

        if (error) throw error;
        setTodos((prev) => [...prev, data]);
        return data;
    };

    const toggleTodo = async (id, currentStatus) => {
        const newStatus = !currentStatus;
        const { error } = await supabase
            .from('todos')
            .update({ is_completed: newStatus })
            .eq('id', id);

        if (error) throw error;
        setTodos((prev) =>
            prev.map((t) => (t.id === id ? { ...t, is_completed: newStatus } : t))
        );
        return newStatus;
    };

    const deleteTodo = async (id) => {
        const { error } = await supabase.from('todos').delete().eq('id', id);
        if (error) throw error;
        setTodos((prev) => prev.filter((t) => t.id !== id));
    };

    // Group todos by date
    const groupedTodos = todos.reduce((groups, todo) => {
        const dateKey = todo.date;
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(todo);
        return groups;
    }, {});

    // Sort dates chronologically (most recent first)
    const sortedGroups = Object.entries(groupedTodos)
        .sort(([a], [b]) => new Date(b) - new Date(a))
        .map(([date, items]) => ({
            date,
            label: formatDateLabel(date),
            items,
            completedCount: items.filter((t) => t.is_completed).length,
            totalCount: items.length,
            isFullyCompleted: items.every((t) => t.is_completed),
        }));

    return {
        todos,
        groupedTodos: sortedGroups,
        loading,
        addTodo,
        toggleTodo,
        deleteTodo,
        refetch: fetchTodos,
    };
}

function formatDateLabel(dateStr) {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMM d');
}
