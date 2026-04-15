import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { format, isToday, isYesterday, parseISO, addDays } from 'date-fns';

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

    const addTodo = async (title, description, date, time, repeatDaily = false) => {
        const { data, error } = await supabase
            .from('todos')
            .insert({
                user_id: user.id,
                title,
                description: description || null,
                date,
                time: time || null,
                is_completed: false,
                repeat_daily: repeatDaily,
            })
            .select()
            .single();

        if (error) throw error;
        setTodos((prev) => [...prev, data]);
        return data;
    };

    const toggleTodo = async (id, currentStatus) => {
        const newStatus = !currentStatus;
        const todo = todos.find((t) => t.id === id);

        const { error } = await supabase
            .from('todos')
            .update({ is_completed: newStatus })
            .eq('id', id);

        if (error) throw error;

        if (newStatus && todo?.repeat_daily && todo?.date) {
            const nextDate = format(addDays(parseISO(todo.date), 1), 'yyyy-MM-dd');
            const { data: newTodo } = await supabase
                .from('todos')
                .insert({
                    user_id: user.id,
                    title: todo.title,
                    description: todo.description,
                    date: nextDate,
                    time: todo.time,
                    is_completed: false,
                    repeat_daily: true,
                })
                .select()
                .single();

            if (newTodo) {
                setTodos((prev) => [...prev, newTodo]);
            }
        }

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

    const deleteGroupTodos = async (date) => {
        const { error } = await supabase
            .from('todos')
            .delete()
            .eq('user_id', user.id)
            .eq('date', date);
        if (error) throw error;
        setTodos((prev) => prev.filter((t) => t.date !== date));
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
        deleteGroupTodos,
        refetch: fetchTodos,
    };
}

function formatDateLabel(dateStr) {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMM d');
}
