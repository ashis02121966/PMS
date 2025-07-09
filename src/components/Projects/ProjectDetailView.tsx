import React, { useState } from 'react';
import { 
  ArrowLeft, Calendar, DollarSign, Users, AlertCircle, CheckCircle, 
  Clock, TrendingUp, FileText, Plus, Edit, Upload, Download, Play, Pause, Square, Check, List
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Project, Issue, ProjectStatusChange } from '../../types/project';
import { ProjectService } from '../../services/projectService';
import TaskManagementView from '../Tasks/TaskManagementView';
import { format } from 'date-fns';

interface ProjectDetailViewProps {
  project: Project;
  onProjectUpdate: (project: Project) => void;
  onEditProject: (project: Project) => void;
  onBack: () => void;
}

const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ 
  project, 
  onProjectUpdate, 
  onEditProject, 
  onBack 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showTaskManagement, setShowTaskManagement] = useState(false);
  const [showAddIssue, setShowAddIssue] = useState(false);
  const [showStatusChange, setShowStatusChange] = useState(false);
  const [showBulkIssueUpload, setShowBulkIssueUpload] = useState(false);
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    severity: 'medium' as const,
    assigned_to: '',
    category: 'bug' as const
  });
  const [statusChange, setStatusChange] = useState({
    project_status: project.project_status,
    status_comment: '',
    status_changed_by: 'Current User'
  });

  const formatCurrency = (amount: number) => {
    if (project.currency === 'INR') {
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

  const openIssues = project.issues?.filter(issue => issue.status === 'open') || [];
  const completedMilestones = project.payment_milestones?.filter(m => m.status === 'completed') || [];

  const progressData = {
    labels: project.weekly_progress?.map(w => `Week ${w.week_number}`) || [],
    datasets: [
      {
        label: 'Progress %',
        data: project.weekly_progress?.map(w => w.progress) || [],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const handleAddIssue = async () => {
    try {
      console.log('Adding issue:', newIssue);
      await ProjectService.createIssue({
        project_id: project.id,
        ...newIssue
      });
      
      // Refresh project data
      const updatedProject = await ProjectService.getProjectById(project.id);
      if (updatedProject) {
        onProjectUpdate(updatedProject);
      }
      
      setNewIssue({ title: '', description: '', severity: 'medium', assigned_to: '', category: 'bug' });
      setShowAddIssue(false);
      alert('Issue added successfully!');
    } catch (error) {
      console.error('Failed to add issue:', error);
      alert(`Failed to add issue: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleStatusChange = async () => {
    try {
      console.log('Updating project status:', statusChange);
      const updatedProject = await ProjectService.updateProjectStatus(project.id, statusChange as ProjectStatusChange);
      onProjectUpdate(updatedProject);
      setShowStatusChange(false);
      alert('Project status updated successfully!');
    } catch (error) {
      console.error('Failed to update project status:', error);
      alert(`Failed to update project status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleBulkIssueUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Parse CSV/Excel file and create issues
      console.log('Bulk issue upload:', file.name);
      // Implementation would parse the file and create multiple issues
      setShowBulkIssueUpload(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green': return 'text-green-800 bg-green-100 border-green-200';
      case 'amber': return 'text-yellow-800 bg-yellow-100 border-yellow-200';
      case 'red': return 'text-red-800 bg-red-100 border-red-200';
      default: return 'text-gray-800 bg-gray-100 border-gray-200';
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-800 bg-green-100 border-green-200';
      case 'inactive': return 'text-gray-800 bg-gray-100 border-gray-200';
      case 'hold': return 'text-yellow-800 bg-yellow-100 border-yellow-200';
      case 'completed': return 'text-blue-800 bg-blue-100 border-blue-200';
      default: return 'text-gray-800 bg-gray-100 border-gray-200';
    }
  };

  const getProjectStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4" />;
      case 'inactive': return <Square className="h-4 w-4" />;
      case 'hold': return <Pause className="h-4 w-4" />;
      case 'completed': return <Check className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (showTaskManagement) {
    return (
      <TaskManagementView
        projectId={project.id}
        projectName={project.name}
        onBack={() => setShowTaskManagement(false)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Projects
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="mt-2 text-gray-600">{project.description}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`flex items-center px-3 py-1 rounded-lg border ${getProjectStatusColor(project.project_status)} font-medium`}>
              {getProjectStatusIcon(project.project_status)}
              <span className="ml-1 capitalize">{project.project_status}</span>
            </div>
            <div className={`flex items-center px-3 py-1 rounded-lg border ${getStatusColor(project.status)} font-medium`}>
              <span className="capitalize">{project.status}</span>
            </div>
            <button 
              onClick={() => setShowTaskManagement(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <List className="h-4 w-4 mr-2" />
              Manage Tasks
            </button>
            <button 
              onClick={() => setShowStatusChange(true)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Change Status
            </button>
            <button 
              onClick={() => onEditProject(project)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Project
            </button>
          </div>
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusChange && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Project Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                <select
                  value={statusChange.project_status}
                  onChange={(e) => setStatusChange({...statusChange, project_status: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comment (Required)</label>
                <textarea
                  value={statusChange.status_comment}
                  onChange={(e) => setStatusChange({...statusChange, status_comment: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Reason for status change..."
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowStatusChange(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusChange}
                disabled={!statusChange.status_comment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Progress</p>
              <p className="text-2xl font-bold text-gray-900">{project.progress}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Project Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(project.project_value)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {formatCurrency(completedMilestones.reduce((sum, m) => sum + m.amount, 0))} collected
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Issues</p>
              <p className="text-2xl font-bold text-gray-900">{openIssues.length}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {(project.issues?.filter(i => i.status === 'resolved').length || 0)} resolved
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Size</p>
              <p className="text-2xl font-bold text-gray-900">{project.resources?.length || 0}</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {project.resources?.length ? Math.round(project.resources.reduce((sum, r) => sum + r.allocation, 0) / project.resources.length) : 0}% avg allocation
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'milestones', label: 'Milestones', icon: CheckCircle },
             { id: 'tasks', label: 'Tasks', icon: List },
              { id: 'issues', label: 'Issues', icon: AlertCircle },
              { id: 'team', label: 'Team', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">{format(new Date(project.start_date), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-medium">{format(new Date(project.end_date), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Currency:</span>
                      <span className="font-medium">{project.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">{format(new Date(project.updated_at), 'MMM dd, yyyy')}</span>
                    </div>
                    {project.status_comment && (
                      <div className="pt-3 border-t border-gray-200">
                        <span className="text-gray-600">Status Comment:</span>
                        <p className="text-sm text-gray-800 mt-1">{project.status_comment}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Changed by {project.status_changed_by} on {project.status_changed_at ? format(new Date(project.status_changed_at), 'MMM dd, yyyy') : 'N/A'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Chart</h3>
                  <div className="h-48">
                    <Line 
                      data={progressData} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        scales: {
                          y: { beginAtZero: true, max: 100 },
                          x: { grid: { display: false } }
                        }
                      }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Payment Milestones</h3>
              <div className="space-y-3">
                {(project.payment_milestones || []).map((milestone) => (
                  <div key={milestone.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{milestone.name}</h4>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                          milestone.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {milestone.status}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <span>Amount: {formatCurrency(milestone.amount)}</span>
                        <span>Due: {format(new Date(milestone.due_date), 'MMM dd, yyyy')}</span>
                        {milestone.completed_date && (
                          <span>Completed: {format(new Date(milestone.completed_date), 'MMM dd, yyyy')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Project Tasks</h3>
                <button
                  onClick={() => setShowTaskManagement(true)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <List className="h-4 w-4 mr-2" />
                  Manage Tasks
                </button>
              </div>
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <List className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">Task Management</p>
                <p className="text-gray-400 text-sm mb-4">
                  Create and manage tasks, set dependencies, allocate resources, and track progress
                </p>
                <button
                  onClick={() => setShowTaskManagement(true)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <List className="h-4 w-4 mr-2" />
                  Open Task Management
                </button>
              </div>
            </div>
          )}

          {activeTab === 'issues' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Project Issues</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowBulkIssueUpload(true)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Bulk Upload
                  </button>
                  <button
                    onClick={() => setShowAddIssue(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Issue
                  </button>
                </div>
              </div>

              {/* Bulk Upload Modal */}
              {showBulkIssueUpload && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 w-full max-w-md">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Upload Issues</h3>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Upload a CSV or Excel file with columns: Title, Description, Severity, Assigned To, Category
                      </p>
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleBulkIssueUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        onClick={() => setShowBulkIssueUpload(false)}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {showAddIssue && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Add New Issue</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Issue title"
                      value={newIssue.title}
                      onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <select
                      value={newIssue.severity}
                      onChange={(e) => setNewIssue({...newIssue, severity: e.target.value as any})}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                    <textarea
                      placeholder="Issue description"
                      value={newIssue.description}
                      onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                      className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md"
                      rows={3}
                    />
                    <input
                      type="text"
                      placeholder="Assigned to"
                      value={newIssue.assigned_to}
                      onChange={(e) => setNewIssue({...newIssue, assigned_to: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <select
                      value={newIssue.category}
                      onChange={(e) => setNewIssue({...newIssue, category: e.target.value as any})}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="bug">Bug</option>
                      <option value="feature">Feature</option>
                      <option value="improvement">Improvement</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      onClick={() => setShowAddIssue(false)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddIssue}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add Issue
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {(project.issues || []).map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{issue.title}</h4>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          issue.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          issue.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {issue.severity}
                        </span>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          issue.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {issue.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{issue.description}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-2">
                        <span>Created: {format(new Date(issue.created_at), 'MMM dd, yyyy')}</span>
                        {issue.assigned_to && <span className="ml-4">Assigned to: {issue.assigned_to}</span>}
                        {issue.week_number && <span className="ml-4">Week: {issue.week_number}/{issue.year}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Team Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(project.resources || []).map((resource) => (
                  <div key={resource.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900">{resource.name}</h4>
                    <p className="text-sm text-gray-600">{resource.role}</p>
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">Allocation</span>
                        <span className="text-xs font-medium">{resource.allocation}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${resource.allocation}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Project Analytics</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Progress Over Time</h4>
                  <div className="h-64">
                    <Line 
                      data={progressData} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        scales: {
                          y: { beginAtZero: true, max: 100 },
                          x: { grid: { display: false } }
                        }
                      }} 
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Key Metrics</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Issues:</span>
                      <span className="font-medium">{project.issues?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Open Issues:</span>
                      <span className="font-medium text-red-600">{openIssues.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Resolved Issues:</span>
                      <span className="font-medium text-green-600">
                        {project.issues?.filter(i => i.status === 'resolved').length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed Milestones:</span>
                      <span className="font-medium">{completedMilestones.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenue Collected:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(completedMilestones.reduce((sum, m) => sum + m.amount, 0))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailView;