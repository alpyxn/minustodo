import { useState } from 'react';

interface TodoProps {
  task: string;
  status: number;
  owner: string;
  id: number;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: number) => Promise<void>;
}

function Todo({ task, status, owner, id, onDelete, onStatusChange }: TodoProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    setError(null);
    
    try {
        await onStatusChange(id, status);
    } catch (error) {
        console.error('Status update failed:', error);
        setError('Failed to update status');
    } finally {
        setIsUpdating(false);
    }
  };

  return (
    <div className="flex justify-center w-full">
      <div className="max-w-screen-md w-full px-6 py-4 bg-slate-600 bg-opacity-95 rounded-lg shadow-md mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 flex-1">
            <input
              type="checkbox"
              checked={status === 1}
              onChange={handleStatusChange}
              disabled={isUpdating}
              className="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
            />
            <div className="flex-1">
              <h1 className={`text-2xl font-semibold text-white ${status === 1 ? 'line-through' : ''}`}>
                {task}
              </h1>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <p className="text-sm text-gray-400 mb-2 ">Owner: {owner}</p>
              <span
                className={`inline-block px-2 py-1 rounded-full text-sm ${
                  status === 1
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-500 text-white"
                }`}
              >
                {status === 1 ? "Completed" : "Uncompleted"}
              </span>
            </div>
          </div>
          <button
            onClick={() => onDelete(id)}
            className="px-3 py-1 bg-rose-600 text-white rounded-md hover:bg-rose-400 transition-colors"
            aria-label="Delete todo"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default Todo;