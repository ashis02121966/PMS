import React from 'react';
import { BarChart3, Bell, Settings, User, Upload } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="ml-3 text-xl font-bold text-gray-900">Project Dashboard</h1>
          </div>
          
          <nav className="flex space-x-8">
            <button
              onClick={() => onViewChange('dashboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onViewChange('projects')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'projects'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => onViewChange('analytics')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'analytics'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => onViewChange('upload-issues')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'upload-issues'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Upload className="h-4 w-4 mr-1" />
              Upload Issues
            </button>
            <button
              onClick={() => onViewChange('create')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'create'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Create Project
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors">
              <Bell className="h-6 w-6" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors">
              <Settings className="h-6 w-6" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors">
              <User className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;