import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import StreakHeader from '../components/StreakHeader';
import TodoGroup from '../components/TodoGroup';
import EmptyState from '../components/EmptyState';
import FloatingAddButton from '../components/FloatingAddButton';
import AddTodoModal from '../components/AddTodoModal';
import { useTodos } from '../hooks/useTodos';
import { useStreak } from '../hooks/useStreak';

export default function DashboardPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const { groupedTodos, loading, addTodo, toggleTodo, deleteTodo } = useTodos();
    const { currentStreak, bestStreak, celebrateStreak, updateStreak } = useStreak();

    const handleToggle = useCallback(
        async (id, currentStatus) => {
            await toggleTodo(id, currentStatus);

            // Only check today's group for streak
            const today = format(new Date(), 'yyyy-MM-dd');
            const todayGroup = groupedTodos.find((g) => g.date === today);

            if (!todayGroup) return;

            // Check if all of today's todos will be completed after this toggle
            const allTodayCompleted = todayGroup.items.every((t) =>
                t.id === id ? !currentStatus : t.is_completed
            );

            if (allTodayCompleted && todayGroup.items.length > 0) {
                updateStreak();
            }
        },
        [toggleTodo, groupedTodos, updateStreak]
    );

    const handleAdd = async (title, description, date) => {
        await addTodo(title, description, date);
    };

    return (
        <div className="min-h-screen bg-stone-50">
            <div className="max-w-lg mx-auto pb-28">
                <StreakHeader
                    currentStreak={currentStreak}
                    bestStreak={bestStreak}
                    celebrateStreak={celebrateStreak}
                />

                <div className="px-5 pt-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : groupedTodos.length === 0 ? (
                        <EmptyState />
                    ) : (
                        groupedTodos.map((group) => (
                            <TodoGroup
                                key={group.date}
                                group={group}
                                onToggle={handleToggle}
                                onDelete={deleteTodo}
                            />
                        ))
                    )}
                </div>
            </div>

            <FloatingAddButton onClick={() => setModalOpen(true)} />
            <AddTodoModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onAdd={handleAdd}
            />
        </div>
    );
}
