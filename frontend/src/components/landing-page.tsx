import { FaClipboardList, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import { keycloak } from '../auth/auth';

const LandingPage = () => {
  const handleLogin = () => {
    keycloak.login();
  };

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
              className="btn btn-primary bg-rose-600 hover:bg-rose-500 border-none text-white"
            >
              <FaUserPlus className="mr-2" />
              Register
            </button>
            <button 
              onClick={handleLogin}
              className="btn bg-slate-700 hover:bg-slate-600 text-white border-none"
            >
              <FaSignInAlt className="mr-2" />
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;