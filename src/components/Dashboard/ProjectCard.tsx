import React from 'react';
import { Calendar, DollarSign, Users, AlertCircle, CheckCircle, Clock, Play, Pause, Square, Check } from 'lucide-react';
import { Project } from '../../types/project';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'amber':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'red':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'green':
        return <CheckCircle className="h-4 w-4" />;
      case 'amber':
        return <Clock className="h-4 w-4" />;
      case 'red':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getProjectStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="h-3 w-3" />;
      case 'inactive':
        return <Square className="h-3 w-3" />;
      case 'hold':
        return <Pause className="h-3 w-3" />;
      case 'completed':
        return <Check className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const formatCurrency = (amount: number) => {
    if (project.currency === 'INR') {
      // Format in Indian numbering system (Lakhs/Crores)
      if (amount >= 10000000) {
        return `₹${(amount / 10000000).toFixed(2)} Cr`;
      } else if (amount >= 100000) {
        return `₹${(amount / 100000).toFixed(2)} L`;
      } else {
        return `₹${amount.toLocaleString('en-IN')}`;
      }
    }
    return `${project.currency} ${amount.toLocaleString()}`;
  };

  const openIssues = project.issues?.filter(issue => issue.status === 'open').length || 0;
  const completedMilestones = project.payment_milestones?.filter(m => m.status === 'completed').length || 0;
  const totalMilestones = project.payment_milestones?.length || 0;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
          <p className="text-sm text-gray-600">{project.description}</p>
        </div>
        <div className="flex flex-col space-y-2">
          <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
            {getStatusIcon(project.status)}
            <span className="ml-1 capitalize">{project.status}</span>
          </div>
          <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getProjectStatusColor(project.project_status)}`}>
            {getProjectStatusIcon(project.project_status)}
            <span className="ml-1 capitalize">{project.project_status}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Progress</span>
          <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{format(new Date(project.end_date), 'MMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign className="h-4 w-4 mr-2" />
          <span>{formatCurrency(project.project_value)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-2" />
          <span>{project.resources?.length || 0} resources</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>{openIssues} open issues</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Milestones: {completedMilestones}/{totalMilestones}</span>
          <span className="text-gray-600">Updated {format(new Date(project.updated_at), 'MMM dd')}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;