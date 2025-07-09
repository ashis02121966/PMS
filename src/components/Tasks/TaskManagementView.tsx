import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Users, Clock, AlertCircle, CheckCircle, Play, Pause, Square, ArrowLeft } from 'lucide-react';
import { Task, TaskDependency, TaskResource } from '../../types/task';
import { TaskService } from '../../services/taskService';
import TaskForm from './TaskForm';
import TaskDependencyForm from './TaskDependencyForm';
import GanttChartView from './GanttChartView';

interface TaskManagementViewProps {
  projectId: string;
  projectName: string;
  onBack: () => void;
}

const TaskManagementView: React.FC<TaskManagementViewProps> = ({ projectId, projectName, onBack }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showDependencyForm, setShowDependencyForm] = useState(false);
  const [showGanttChart, setShowGanttChart] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTaskForDependency, setSelectedTaskForDependency] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await TaskService.getTasksByProject(projectId);
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await TaskService.createTask({ ...taskData, project_id: projectId });
      await loadTasks();
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingTask) return;
    
    try {
      await TaskService.updateTask(editingTask.id, taskData);
      await loadTasks();
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await TaskService.deleteTask(taskId);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  const handleCreateDependency = async (dependency: Omit<TaskDependency, 'id' | 'created_at'>) => {
    try {
      await TaskService.createTaskDependency(dependency);
      await loadTasks();
      setShowDependencyForm(false);
      setSelectedTaskForDependency(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create dependency');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-800 bg-green-100 border-green-200';
      case 'in_progress': return 'text-blue-800 bg-blue-100 border-blue-200';
      case 'on_hold': return 'text-yellow-800 bg-yellow-100 border-yellow-200';
      case 'cancelled': return 'text-red-800 bg-red-100 border-red-200';
      default: return 'text-gray-800 bg-gray-100 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-800 bg-red-100 border-red-200';
      case 'high': return 'text-orange-800 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-800 bg-yellow-100 border-yellow-200';
      default: return 'text-green-800 bg-green-100 border-green-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Play className="h-4 w-4" />;
      case 'on_hold': return <Pause className="h-4 w-4" />;
      case 'cancelled': return <Square className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const calculateDeviation = (task: Task) => {
    if (!task.planned_start_date || !task.actual_start_date) return null;
    
    const plannedStart = new Date(task.planned_start_date);
    const actualStart = new Date(task.actual_start_date);
    const diffTime = actualStart.getTime() - plannedStart.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showGanttChart) {
    return (
      <GanttChartView 
        projectId={projectId} 
        projectName={projectName}
        onBack={() => setShowGanttChart(false)} 
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
          Back to Project
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
            <p className="mt-2 text-gray-600">Project: {projectName}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowGanttChart(true)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Gantt Chart
            </button>
            <button
              onClick={() => setShowTaskForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Task Forms */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          projectId={projectId}
          availableTasks={tasks}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
        />
      )}

      {showDependencyForm && selectedTaskForDependency && (
        <TaskDependencyForm
          taskId={selectedTaskForDependency}
          availableTasks={tasks.filter(t => t.id !== selectedTaskForDependency)}
          onSubmit={handleCreateDependency}
          onCancel={() => {
            setShowDependencyForm(false);
            setSelectedTaskForDependency(null);
          }}
        />
      )}

      {/* Tasks List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Tasks ({tasks.length})</h2>
        </div>
        
        {tasks.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">No tasks found</p>
            <p className="text-gray-400 text-sm">Create your first task to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {tasks.map((task) => {
              const deviation = calculateDeviation(task);
              
              return (
                <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{task.name}</h3>
                        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                          <span className="ml-1 capitalize">{task.status.replace('_', ' ')}</span>
                        </div>
                        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          <span className="capitalize">{task.priority}</span>
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-gray-600 mb-3">{task.description}</p>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Progress</p>
                          <div className="flex items-center mt-1">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{task.progress}%</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Planned Duration</p>
                          <p className="text-sm text-gray-600">
                            {task.planned_start_date && task.planned_end_date ? (
                              `${task.planned_start_date} to ${task.planned_end_date}`
                            ) : (
                              'Not set'
                            )}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Hours</p>
                          <p className="text-sm text-gray-600">
                            {task.actual_hours}h / {task.estimated_hours}h
                            {task.estimated_hours > 0 && (
                              <span className={`ml-2 ${task.actual_hours > task.estimated_hours ? 'text-red-600' : 'text-green-600'}`}>
                                ({task.actual_hours > task.estimated_hours ? '+' : ''}{(task.actual_hours - task.estimated_hours).toFixed(1)}h)
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      
                      {deviation !== null && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700">Schedule Deviation</p>
                          <p className={`text-sm ${deviation > 0 ? 'text-red-600' : deviation < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                            {deviation > 0 ? `${deviation} days behind` : deviation < 0 ? `${Math.abs(deviation)} days ahead` : 'On schedule'}
                          </p>
                        </div>
                      )}
                      
                      {task.resources && task.resources.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Assigned Resources</p>
                          <div className="flex flex-wrap gap-2">
                            {task.resources.map((resource) => (
                              <div key={resource.id} className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                                <Users className="h-3 w-3 mr-1 text-blue-600" />
                                <span className="text-xs text-blue-800">
                                  {resource.resource_name} ({resource.allocation_percentage}%)
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {task.dependencies && task.dependencies.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Dependencies</p>
                          <div className="flex flex-wrap gap-2">
                            {task.dependencies.map((dep) => {
                              const predecessorTask = tasks.find(t => t.id === dep.predecessor_task_id);
                              return (
                                <div key={dep.id} className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                                  <span className="text-xs text-yellow-800">
                                    {predecessorTask?.name || 'Unknown'} ({dep.dependency_type.replace('_', ' ')})
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedTaskForDependency(task.id);
                          setShowDependencyForm(true);
                        }}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Add Dependency"
                      >
                        <Calendar className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingTask(task);
                          setShowTaskForm(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Task"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManagementView;