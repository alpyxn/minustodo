import { FaClipboardList, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../auth/AuthContext';

const LandingPage = () => {
  const { login, keycloak } = useAuth();

  const handleRegister = () => {
    keycloak.register();
  };

  return (
    <div className="hero min-h-screen bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <div className="mb-8 flex justify-center">
            <FaClipboardList className="text-6xl text-rose-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Todo Manager</h1>
          <p className="text-2xl font-bold text-rose-400 mb-8">Start managing your tasks today!</p>
          <p className="text-slate-300 mb-8">
            Organize your tasks efficiently, track your progress, and boost your productivity
            with our intuitive todo management application.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={handleRegister}
              className="flex items-center justify-center px-4 py-2 text-white bg-rose-600 rounded-lg 
                       hover:bg-rose-500 transition-colors duration-200 font-medium"
            >
              <FaUserPlus className="mr-2" />
              <span>Register</span>
            </button>
            <button 
              onClick={()=>{login()}
          }
              className="flex items-center justify-center px-4 py-2 text-white bg-slate-700 hover:bg-slate-600 
                       rounded-lg transition-colors duration-200 font-medium"
            >
              <FaSignInAlt className="mr-2" />
              <span>Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;