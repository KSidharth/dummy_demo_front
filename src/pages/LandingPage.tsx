
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();

  useEffect(() => {
    if (isAuthenticated && userRole === 'manager') {
      navigate('/manager/dashboard', { replace: true });
    } else if (isAuthenticated && userRole === 'employee') {
      navigate('/employee/dashboard', { replace: true });
    }
  }, [isAuthenticated, userRole, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-12 rounded-2xl shadow-2xl max-w-md w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Hike Evaluation System
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Select your role to continue
        </p>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/manager/login')}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            Manager
          </button>
          <button
            onClick={() => navigate('/employee/login')}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
          >
            Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
