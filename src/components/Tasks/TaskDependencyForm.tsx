import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Task, TaskDependency } from '../../types/task';

interface TaskDependencyFormProps {
  taskId: string;
  availableTasks: Task[];
  onSubmit: (dependency: Omit<TaskDependency, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

const TaskDependencyForm: React.FC<TaskDependencyFormProps> = ({ 
  taskId, 
  availableTasks, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    predecessor_task_id: '',
    dependency_type: 'finish_to_start' as const,
    lag_days: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.predecessor_task_id) {
      alert('Please select a predecessor task');
      return;
    }

    const dependency: Omit<TaskDependency, 'id' | 'created_at'> = {
      predecessor_task_id: formData.predecessor_task_id,
      successor_task_id: taskId,
      dependency_type: formData.dependency_type,
      lag_days: formData.lag_days
    };

    onSubmit(dependency);
  };

  const dependencyTypes = [
    { value: 'finish_to_start', label: 'Finish to Start (FS)', description: 'Predecessor must finish before successor can start' },
    { value: 'start_to_start', label: 'Start to Start (SS)', description: 'Both tasks must start at the same time' },
    { value: 'finish_to_finish', label: 'Finish to Finish (FF)', description: 'Both tasks must finish at the same time' },
    { value: 'start_to_finish', label: 'Start to Finish (SF)', description: 'Predecessor must start before successor can finish' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Add Task Dependency</h2>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Predecessor Task *
            </label>
            <select
              value={formData.predecessor_task_id}
              onChange={(e) => setFormData({ ...formData, predecessor_task_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a predecessor task</option>
              {availableTasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              The task that must be completed before the current task can proceed
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dependency Type *
            </label>
            <select
              value={formData.dependency_type}
              onChange={(e) => setFormData({ ...formData, dependency_type: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {dependencyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                {dependencyTypes.find(t => t.value === formData.dependency_type)?.description}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lag Days
            </label>
            <input
              type="number"
              value={formData.lag_days}
              onChange={(e) => setFormData({ ...formData, lag_days: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
            <p className="mt-1 text-sm text-gray-500">
              Additional delay in days after the dependency condition is met (can be negative for overlap)
            </p>
          </div>

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
              Add Dependency
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskDependencyForm;