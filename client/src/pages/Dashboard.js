import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={logout}
              className="btn-secondary"
            >
              Logout
            </button>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name || 'User'}!</h2>
            <p className="text-gray-600">
              Your Skill Swap dashboard is coming soon. This is where you'll manage your skills, 
              view swap requests, and connect with other users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 