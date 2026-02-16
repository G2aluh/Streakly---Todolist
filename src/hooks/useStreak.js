import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { format, parseISO, differenceInCalendarDays } from 'date-fns';

export function useStreak() {
    const { user } = useAuth();
    const [currentStreak, setCurrentStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [loading, setLoading] = useState(true);
    const [celebrateStreak, setCelebrateStreak] = useState(false);

    const fetchStreak = useCallback(async () => {
        if (!user) return;
        setLoading(true);

        let { data, error } = await supabase
            .from('streaks')
            .select('*')
            .eq('user_id', user.id)
            .single();

        // Create streak record if it doesn't exist
        if (error && error.code === 'PGRST116') {
            const { data: newStreak } = await supabase
                .from('streaks')
                .insert({ user_id: user.id, current_streak: 0, best_streak: 0 })
                .select()
                .single();
            data = newStreak;
        }

        if (data) {
            const today = format(new Date(), 'yyyy-MM-dd');
            const lastDate = data.last_completed_date;

            if (lastDate) {
                const daysDiff = differenceInCalendarDays(
                    parseISO(today),
                    parseISO(lastDate)
                );
                if (daysDiff > 1) {
                    // Streak broken — reset current but keep best
                    await supabase
                        .from('streaks')
                        .update({ current_streak: 0, last_completed_date: null })
                        .eq('user_id', user.id);
                    setCurrentStreak(0);
                } else {
                    setCurrentStreak(data.current_streak);
                }
            } else {
                setCurrentStreak(data.current_streak);
            }

            setBestStreak(data.best_streak || 0);
        }

        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchStreak();
    }, [fetchStreak]);

    const updateStreak = useCallback(
        async () => {
            if (!user) return;

            const today = format(new Date(), 'yyyy-MM-dd');

            // Query DB directly to check if ALL today's todos are completed
            const { data: todayTodos, error: todosError } = await supabase
                .from('todos')
                .select('id, is_completed')
                .eq('user_id', user.id)
                .eq('date', today);

            if (todosError || !todayTodos || todayTodos.length === 0) return;

            const allCompleted = todayTodos.every((t) => t.is_completed);
            if (!allCompleted) return;

            // All today's todos done — update streak
            const { data: streakData } = await supabase
                .from('streaks')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (!streakData) return;

            const lastDate = streakData.last_completed_date;

            // Already counted today
            if (lastDate === today) return;

            let newStreak;

            if (!lastDate) {
                newStreak = 1;
            } else {
                const daysDiff = differenceInCalendarDays(
                    parseISO(today),
                    parseISO(lastDate)
                );
                if (daysDiff === 1) {
                    newStreak = streakData.current_streak + 1;
                } else {
                    newStreak = 1;
                }
            }

            // Calculate new best streak
            const currentBest = streakData.best_streak || 0;
            const newBest = Math.max(currentBest, newStreak);

            await supabase
                .from('streaks')
                .update({
                    current_streak: newStreak,
                    best_streak: newBest,
                    last_completed_date: today,
                })
                .eq('user_id', user.id);

            setCurrentStreak(newStreak);
            setBestStreak(newBest);

            setCelebrateStreak(true);
            setTimeout(() => setCelebrateStreak(false), 2000);
        },
        [user]
    );

    return {
        currentStreak,
        bestStreak,
        loading,
        celebrateStreak,
        updateStreak,
        refetch: fetchStreak,
    };
}
