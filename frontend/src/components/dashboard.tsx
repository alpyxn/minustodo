import { useTodos } from '../hooks/useTodos';
import { useNavigate } from 'react-router-dom'; // Fixed import from react-router to react-router-dom
import { FaClipboardList, FaClipboardCheck, FaRegClock, FaTasks } from 'react-icons/fa';

const Dashboard = ({ refreshTrigger = 0 }) => {
  const navigate = useNavigate(); // Initialize the navigate function
  const { todos, loading, error } = useTodos(refreshTrigger);

  // Calculate statistics
  const totalTasks = todos.length;
  const completedTasks = todos.filter(todo => todo.status === 1).length;
  const uncompletedTasks = totalTasks - completedTasks;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg text-rose-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">Task Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Tasks Card */}
        <div className="card bg-slate-600 text-white shadow-xl">
          <div className="card-body items-center text-center">
            <div className="p-4 bg-slate-700 rounded-full mb-2">
              <FaTasks className="w-8 h-8 text-rose-400" />
            </div>
            <h2 className="card-title text-2xl">Total Tasks</h2>
            <p className="text-5xl font-bold text-rose-400">{totalTasks}</p>
          </div>
        </div>
        
        {/* Uncompleted Tasks Card */}
        <div className="card bg-slate-600 text-white shadow-xl">
          <div className="card-body items-center text-center">
            <div className="p-4 bg-slate-700 rounded-full mb-2">
              <FaRegClock className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="card-title text-2xl">Uncompleted</h2>
            <p className="text-5xl font-bold text-yellow-400">{uncompletedTasks}</p>
          </div>
        </div>
        
        {/* Completed Tasks Card */}
        <div className="card bg-slate-600 text-white shadow-xl">
          <div className="card-body items-center text-center">
            <div className="p-4 bg-slate-700 rounded-full mb-2">
              <FaClipboardCheck className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="card-title text-2xl">Completed</h2>
            <p className="text-5xl font-bold text-green-400">{completedTasks}</p>
          </div>
        </div>
      </div>
      
      {/* Manage Todos Button */}
      <div className="flex justify-center mt-8">
        <button 
          onClick={() => navigate('/todos')} 
          className="btn btn-primary bg-rose-600 hover:bg-rose-500 border-none text-white text-lg px-8 py-3"
        >
          <FaClipboardList className="mr-2" />
          Manage Todos
        </button>
      </div>
    </div>
  );
};

export default Dashboard;