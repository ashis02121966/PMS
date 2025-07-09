import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Task, TaskResource } from '../../types/task';

interface TaskFormProps {
  task?: Task | null;
  projectId: string;
  availableTasks: Task[];
  onSubmit: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, projectId, availableTasks, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'not_started' as const,
    priority: 'medium' as const,
    planned_start_date: '',
    planned_end_date: '',
    actual_start_date: '',
    actual_end_date: '',
    progress: 0,
    estimated_hours: 0,
    actual_hours: 0
  });

  const [resources, setResources] = useState<Omit<TaskResource, 'id' | 'task_id' | 'created_at'>[]>([]);

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        planned_start_date: task.planned_start_date || '',
        planned_end_date: task.planned_end_date || '',
        actual_start_date: task.actual_start_date || '',
        actual_end_date: task.actual_end_date || '',
        progress: task.progress,
        estimated_hours: task.estimated_hours,
        actual_hours: task.actual_hours
      });
      setResources(task.resources?.map(r => ({
        resource_name: r.resource_name,
        role: r.role,
        allocation_percentage: r.allocation_percentage,
        planned_start_date: r.planned_start_date,
        planned_end_date: r.planned_end_date,
        actual_start_date: r.actual_start_date,
        actual_end_date: r.actual_end_date,
        hourly_rate: r.hourly_rate
      })) || []);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Task name is required');
      return;
    }

    if (formData.estimated_hours < 0) {
      alert('Estimated hours cannot be negative');
      return;
    }

    if (formData.actual_hours < 0) {
      alert('Actual hours cannot be negative');
      return;
    }

    if (formData.progress < 0 || formData.progress > 100) {
      alert('Progress must be between 0 and 100');
      return;
    }

    // Validate resources
    for (const resource of resources) {
      if (!resource.resource_name.trim() || !resource.role.trim()) {
        alert('All resource fields are required');
        return;
      }
      if (resource.allocation_percentage < 0 || resource.allocation_percentage > 100) {
        alert('Resource allocation must be between 0 and 100');
        return;
      }
    }

    const taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'> = {
      project_id: projectId,
      ...formData,
      resources: resources.length > 0 ? resources : undefined,
      dependencies: undefined // Dependencies are managed separately
    };

    onSubmit(taskData);
  };

  const addResource = () => {
    setResources([...resources, {
      resource_name: '',
      role: '',
      allocation_percentage: 100,
      planned_start_date: '',
      planned_end_date: '',
      actual_start_date: '',
      actual_end_date: '',
      hourly_rate: 0
    }]);
  };

  const updateResource = (index: number, field: keyof Omit<TaskResource, 'id' | 'task_id' | 'created_at'>, value: string | number) => {
    const updated = [...resources];
    updated[index] = { ...updated[index], [field]: value };
    setResources(updated);
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter task name"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Enter task description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.estimated_hours}
                onChange={(e) => setFormData({ ...formData, estimated_hours: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Actual Hours</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.actual_hours}
                onChange={(e) => setFormData({ ...formData, actual_hours: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Planned Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Planned Start Date</label>
              <input
                type="date"
                value={formData.planned_start_date}
                onChange={(e) => setFormData({ ...formData, planned_start_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Planned End Date</label>
              <input
                type="date"
                value={formData.planned_end_date}
                onChange={(e) => setFormData({ ...formData, planned_end_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Actual Start Date</label>
              <input
                type="date"
                value={formData.actual_start_date}
                onChange={(e) => setFormData({ ...formData, actual_start_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Actual End Date</label>
              <input
                type="date"
                value={formData.actual_end_date}
                onChange={(e) => setFormData({ ...formData, actual_end_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Resources */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Task Resources</h3>
              <button
                type="button"
                onClick={addResource}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </button>
            </div>

            {resources.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No resources assigned</p>
            ) : (
              <div className="space-y-4">
                {resources.map((resource, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border border-gray-200 rounded-lg">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Resource Name</label>
                      <input
                        type="text"
                        value={resource.resource_name}
                        onChange={(e) => updateResource(index, 'resource_name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                      <input
                        type="text"
                        value={resource.role}
                        onChange={(e) => updateResource(index, 'role', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Role"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Allocation %</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={resource.allocation_percentage}
                        onChange={(e) => updateResource(index, 'allocation_percentage', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Hourly Rate</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={resource.hourly_rate}
                        onChange={(e) => updateResource(index, 'hourly_rate', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={resource.planned_start_date || ''}
                        onChange={(e) => updateResource(index, 'planned_start_date', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeResource(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;