import { useEffect } from "react";
import { useTodos } from '../hooks/useTodos';
import Todo from "./todo";
import TodoInput from './todo-input';

function TodoTable({ refreshTrigger = 0 }) {
    const { 
        todos, 
        error, 
        loading, 
        handleAddTask, 
        handleStatusChange, 
        handleDelete 
    } = useTodos(refreshTrigger);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-gray-600">Loading tasks...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-red-600">Error: {error}</div>
            </div>
        );
    }
    
    // Sort todos: uncompleted first (status === 0), then completed (status === 1)
    const sortedTodos = [...todos].sort((a, b) => a.status - b.status);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100">
            <TodoInput onTaskAdded={handleAddTask} />
            <div className="w-full max-w-screen-md px-4">
                {sortedTodos.length > 0 ? (
                    sortedTodos.map(todo => (
                        <Todo 
                            key={todo.id}
                            {...todo}
                            onDelete={() => handleDelete(todo.id)}
                            onStatusChange={handleStatusChange}
                        />
                    ))
                ) : (
                    <div className="flex justify-center py-8 text-gray-500">
                        No todos found
                    </div>
                )}
            </div>
        </div>
    );
}

export default TodoTable;