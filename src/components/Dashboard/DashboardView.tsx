import React from 'react';
import { BarChart, Users, AlertTriangle, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import StatusCard from './StatusCard';
import ProjectCard from './ProjectCard';
import { Project } from '../../types/project';

interface DashboardViewProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  onStatusDrillDown?: (status: 'green' | 'amber' | 'red') => void;
  onViewAllProjects?: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ 
  projects, 
  onProjectClick, 
  onStatusDrillDown,
  onViewAllProjects 
}) => {
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.project_status === 'active').length;
  const completedProjects = projects.filter(p => p.project_status === 'completed').length;
  const totalIssues = projects.reduce((sum, p) => sum + (p.issues?.length || 0), 0);
  const openIssues = projects.reduce((sum, p) => sum + (p.issues?.filter(i => i.status === 'open').length || 0), 0);
  const totalValue = projects.reduce((sum, p) => sum + p.project_value, 0);

  const formatCurrency = (amount: number) => {
    // Format in Indian numbering system (Lakhs/Crores)
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  };

  const statusCounts = {
    green: projects.filter(p => p.status === 'green').length,
    amber: projects.filter(p => p.status === 'amber').length,
    red: projects.filter(p => p.status === 'red').length
  };

  const handleStatusDrillDown = (status: 'green' | 'amber' | 'red') => {
    if (onStatusDrillDown) {
      onStatusDrillDown(status);
    } else {
      // Default behavior - show alert with project names
      const statusProjects = projects.filter(p => p.status === status);
      const projectNames = statusProjects.map(p => p.name).join('\n');
      alert(`${status.toUpperCase()} Projects:\n\n${projectNames || 'No projects found'}`);
    }
  };

  const handleViewAllProjects = () => {
    if (onViewAllProjects) {
      onViewAllProjects();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Project Dashboard</h1>
        <p className="mt-2 text-gray-600">Monitor your project portfolio health and progress</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatusCard
          title="Total Projects"
          value={totalProjects}
          change={12}
          changeType="increase"
          icon={<BarChart className="h-6 w-6" />}
          color="blue"
        />
        <StatusCard
          title="Active Projects"
          value={activeProjects}
          change={8}
          changeType="increase"
          icon={<TrendingUp className="h-6 w-6" />}
          color="green"
        />
        <StatusCard
          title="Completed Projects"
          value={completedProjects}
          change={25}
          changeType="increase"
          icon={<CheckCircle className="h-6 w-6" />}
          color="blue"
        />
        <StatusCard
          title="Open Issues"
          value={openIssues}
          change={15}
          changeType="decrease"
          icon={<AlertTriangle className="h-6 w-6" />}
          color="red"
        />
        <StatusCard
          title="Portfolio Value"
          value={formatCurrency(totalValue)}
          change={5}
          changeType="increase"
          icon={<Users className="h-6 w-6" />}
          color="yellow"
        />
      </div>

      {/* Project Status Overview with Drill-down */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Project Health Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            className="text-center cursor-pointer hover:bg-green-50 p-4 rounded-lg transition-colors"
            onClick={() => handleStatusDrillDown('green')}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{statusCounts.green}</p>
            <p className="text-sm text-gray-600">Green Projects</p>
            <p className="text-xs text-green-600 mt-1">Click to view details</p>
          </div>
          <div 
            className="text-center cursor-pointer hover:bg-yellow-50 p-4 rounded-lg transition-colors"
            onClick={() => handleStatusDrillDown('amber')}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{statusCounts.amber}</p>
            <p className="text-sm text-gray-600">Amber Projects</p>
            <p className="text-xs text-yellow-600 mt-1">Click to view details</p>
          </div>
          <div 
            className="text-center cursor-pointer hover:bg-red-50 p-4 rounded-lg transition-colors"
            onClick={() => handleStatusDrillDown('red')}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mx-auto mb-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{statusCounts.red}</p>
            <p className="text-sm text-gray-600">Red Projects</p>
            <p className="text-xs text-red-600 mt-1">Click to view details</p>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
          <button 
            onClick={handleViewAllProjects}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors hover:underline"
          >
            View All Projects →
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => onProjectClick(project)}
            />
          ))}
        </div>
        {projects.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <BarChart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">No projects found</p>
            <p className="text-gray-400 text-sm">Create your first project to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardView;