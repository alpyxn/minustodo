import { useState, useCallback, useEffect } from 'react';
import { Todo } from '../types/todo';
import { fetchTasks, addTask, updateTaskStatus, deleteTask } from '../api/api.ts';

// Add a refreshTrigger parameter to your hook
export function useTodos(refreshTrigger = 0) {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const loadTasks = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchTasks();
            setTodos(data);
            setError(null);
        } catch (error) {
            console.error('Error loading tasks:', error);
            setError('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    }, []);
    
    // Add refreshTrigger to the dependency array
    useEffect(() => {
        loadTasks();
    }, [loadTasks, refreshTrigger]);

    const handleAddTask = useCallback(async (taskText: string) => {
        try {
              await addTask(taskText);
            
            // Refresh the task list after adding
            await loadTasks();
        } catch (error) {
            console.error('Error adding task:', error);
            throw error;
        }
    }, [loadTasks]);

    const handleStatusChange = useCallback(async (id: number, currentStatus: number) => {
        try {
            const newStatus = currentStatus === 0 ? 1 : 0;
            
            // Update optimistically
            setTodos(prev => prev.map(todo => 
                todo.id === id ? { ...todo, status: newStatus } : todo
            ));
            
            await updateTaskStatus(id, newStatus);
        } catch (error) {
            // Revert on failure
            setTodos(prev => prev.map(todo => 
                todo.id === id ? { ...todo, status: currentStatus } : todo
            ));
            console.error('Status update failed:', error);
            throw error;
        }
    }, []);

    const handleDelete = useCallback(async (id: number) => {
        try {
            await deleteTask(id.toString());
            await loadTasks();
        } catch (error) {
            throw new Error(`Failed to delete task: ${error}`);
        }
    }, [loadTasks]);

    return {
        todos,
        error,
        loading,
        loadTasks,
        handleAddTask,
        handleStatusChange,
        handleDelete
    };
}