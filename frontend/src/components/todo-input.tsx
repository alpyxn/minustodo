import { useState } from 'react';

interface TodoInputProps {
  onTaskAdded: (todoInput: string) => Promise<void>;
}

function TodoInput({onTaskAdded}: TodoInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onTaskAdded(inputValue.trim());
      setInputValue('');
    } catch (error) {
      setError('Failed to add task');
      console.error('Failed to add task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mb-10 mt-10 max-w-screen-md px-4"> 
      <div className="w-full px-6 py-4 bg-slate-600 rounded-lg shadow-md"> 
        <h1 className="text-2xl font-bold text-gray-300 mb-4">Todo List</h1>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            name="todoInput"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
            disabled={isSubmitting}
            required
            minLength={3}
            maxLength={100}
          />
          <button
            type="submit"
            disabled={isSubmitting || !inputValue.trim()}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg font-extrabold text-lg hover:bg-rose-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed" 
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </button>
        </form>
        {error && (
          <p className="text-red-400 mt-2 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}

export default TodoInput;