import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Plus, Upload, Download, FileSpreadsheet } from 'lucide-react';
import { Project, Resource, PaymentMilestone } from '../../types/project';

interface EditProjectViewProps {
  project: Project;
  onProjectUpdate: (project: Project) => void;
  onCancel: () => void;
}

const EditProjectView: React.FC<EditProjectViewProps> = ({ project, onProjectUpdate, onCancel }) => {
  const [projectData, setProjectData] = useState({
    name: project.name,
    description: project.description,
    start_date: project.start_date,
    end_date: project.end_date,
    project_value: project.project_value,
    currency: project.currency,
    status: project.status,
    project_status: project.project_status,
    progress: project.progress,
  });

  const [resources, setResources] = useState<Resource[]>(project.resources || []);
  const [milestones, setMilestones] = useState<PaymentMilestone[]>(project.payment_milestones || []);

  const formatCurrency = (amount: number) => {
    if (projectData.currency === 'INR') {
      if (amount >= 10000000) {
        return `₹${(amount / 10000000).toFixed(2)} Cr`;
      } else if (amount >= 100000) {
        return `₹${(amount / 100000).toFixed(2)} L`;
      } else {
        return `₹${amount.toLocaleString('en-IN')}`;
      }
    }
    return `${projectData.currency} ${amount.toLocaleString()}`;
  };

  const addResource = () => {
    const newResource: Resource = {
      id: `temp-${Date.now()}`,
      project_id: project.id,
      name: '',
      role: '',
      allocation: 100,
      created_at: new Date().toISOString()
    };
    setResources([...resources, newResource]);
  };

  const updateResource = (index: number, field: keyof Resource, value: string | number) => {
    const updated = [...resources];
    updated[index] = { ...updated[index], [field]: value };
    setResources(updated);
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const addMilestone = () => {
    const newMilestone: PaymentMilestone = {
      id: `temp-${Date.now()}`,
      project_id: project.id,
      name: '',
      amount: 0,
      due_date: '',
      status: 'pending',
      created_at: new Date().toISOString()
    };
    setMilestones([...milestones, newMilestone]);
  };

  const updateMilestone = (index: number, field: keyof PaymentMilestone, value: string | number) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    console.log('Updating project with data:', { projectData, resources, milestones });
    
    const updatedProject: Project = {
      ...project,
      ...projectData,
      resources,
      payment_milestones: milestones,
      updated_at: new Date().toISOString()
    };

    onProjectUpdate(updatedProject);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={onCancel}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Project Details
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
        <p className="mt-2 text-gray-600">Update project details, resources, and milestones</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-8">
          {/* Project Details */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  value={projectData.name}
                  onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={projectData.description}
                  onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={projectData.start_date}
                  onChange={(e) => setProjectData({ ...projectData, start_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={projectData.end_date}
                  onChange={(e) => setProjectData({ ...projectData, end_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Value</label>
                <input
                  type="number"
                  value={projectData.project_value}
                  onChange={(e) => setProjectData({ ...projectData, project_value: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {projectData.project_value > 0 && (
                  <p className="mt-1 text-sm text-gray-600">
                    {formatCurrency(projectData.project_value)}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Progress (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={projectData.progress}
                  onChange={(e) => setProjectData({ ...projectData, progress: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Status</label>
                <select
                  value={projectData.project_status}
                  onChange={(e) => setProjectData({ ...projectData, project_status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Health Status</label>
                <select
                  value={projectData.status}
                  onChange={(e) => setProjectData({ ...projectData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="green">Green</option>
                  <option value="amber">Amber</option>
                  <option value="red">Red</option>
                </select>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Team Resources</h2>
              <button
                onClick={addResource}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </button>
            </div>
            <div className="space-y-4">
              {resources.map((resource, index) => (
                <div key={resource.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
                  <input
                    type="text"
                    value={resource.name}
                    onChange={(e) => updateResource(index, 'name', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Resource name"
                  />
                  <input
                    type="text"
                    value={resource.role}
                    onChange={(e) => updateResource(index, 'role', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Role"
                  />
                  <input
                    type="number"
                    value={resource.allocation}
                    onChange={(e) => updateResource(index, 'allocation', parseInt(e.target.value) || 0)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Allocation %"
                    min="0"
                    max="100"
                  />
                  <button
                    onClick={() => removeResource(index)}
                    className="flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Payment Milestones</h2>
              <button
                onClick={addMilestone}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Milestone
              </button>
            </div>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg">
                  <input
                    type="text"
                    value={milestone.name}
                    onChange={(e) => updateMilestone(index, 'name', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Milestone name"
                  />
                  <input
                    type="number"
                    value={milestone.amount}
                    onChange={(e) => updateMilestone(index, 'amount', parseInt(e.target.value) || 0)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Amount (₹)"
                  />
                  <input
                    type="date"
                    value={milestone.due_date}
                    onChange={(e) => updateMilestone(index, 'due_date', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <select
                    value={milestone.status}
                    onChange={(e) => updateMilestone(index, 'status', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </select>
                  <button
                    onClick={() => removeMilestone(index)}
                    className="flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={onCancel}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProjectView;