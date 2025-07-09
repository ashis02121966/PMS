import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Calendar, Filter, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { TaskService } from '../../services/taskService';
import { GanttTask } from '../../types/task';

interface GanttChartViewProps {
  projectId: string;
  projectName: string;
  onBack: () => void;
}

const GanttChartView: React.FC<GanttChartViewProps> = ({ projectId, projectName, onBack }) => {
  const [ganttTasks, setGanttTasks] = useState<GanttTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'days' | 'weeks' | 'months'>('weeks');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadGanttData();
  }, [projectId]);

  useEffect(() => {
    if (ganttTasks.length > 0) {
      drawGanttChart();
    }
  }, [ganttTasks, viewMode]);

  const loadGanttData = async () => {
    try {
      setLoading(true);
      const data = await TaskService.generateGanttData(projectId);
      setGanttTasks(data);
      
      if (data.length > 0) {
        const dates = data.flatMap(task => [task.start, task.end]);
        const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
        
        // Add some padding
        minDate.setDate(minDate.getDate() - 7);
        maxDate.setDate(maxDate.getDate() + 7);
        
        setStartDate(minDate);
        setEndDate(maxDate);
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Gantt data');
    } finally {
      setLoading(false);
    }
  };

  const drawGanttChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    if (ganttTasks.length === 0) {
      ctx.fillStyle = '#6b7280';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('No tasks to display', canvasWidth / 2, canvasHeight / 2);
      return;
    }

    // Chart dimensions
    const leftMargin = 200;
    const topMargin = 60;
    const rightMargin = 50;
    const bottomMargin = 50;
    const chartWidth = canvasWidth - leftMargin - rightMargin;
    const chartHeight = canvasHeight - topMargin - bottomMargin;
    const rowHeight = 40;

    // Time calculations
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const dayWidth = chartWidth / totalDays;

    // Draw header
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${projectName} - Gantt Chart`, 20, 30);

    // Draw time scale
    ctx.fillStyle = '#374151';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    const timeScale = getTimeScale(startDate, endDate, viewMode);
    timeScale.forEach((timePoint, index) => {
      const x = leftMargin + (timePoint.position * chartWidth);
      ctx.fillText(timePoint.label, x, topMargin - 10);
      
      // Draw vertical grid lines
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, topMargin);
      ctx.lineTo(x, topMargin + Math.min(chartHeight, ganttTasks.length * rowHeight));
      ctx.stroke();
    });

    // Draw tasks
    ganttTasks.forEach((task, index) => {
      const y = topMargin + (index * rowHeight);
      
      // Draw task name
      ctx.fillStyle = '#374151';
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(
        task.name.length > 25 ? task.name.substring(0, 25) + '...' : task.name,
        10,
        y + rowHeight / 2 + 5
      );

      // Calculate task bar position and width
      const taskStartDays = Math.ceil((task.start.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const taskDuration = Math.ceil((task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24));
      
      const barX = leftMargin + (taskStartDays * dayWidth);
      const barWidth = Math.max(taskDuration * dayWidth, 10); // Minimum width of 10px
      const barY = y + 8;
      const barHeight = rowHeight - 16;

      // Draw task bar background
      ctx.fillStyle = getTaskColor(task.status, 0.3);
      ctx.fillRect(barX, barY, barWidth, barHeight);

      // Draw progress bar
      if (task.progress > 0) {
        ctx.fillStyle = getTaskColor(task.status, 1);
        ctx.fillRect(barX, barY, (barWidth * task.progress) / 100, barHeight);
      }

      // Draw task bar border
      ctx.strokeStyle = getTaskColor(task.status, 1);
      ctx.lineWidth = 2;
      ctx.strokeRect(barX, barY, barWidth, barHeight);

      // Draw progress text
      if (barWidth > 40) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${task.progress}%`, barX + barWidth / 2, barY + barHeight / 2 + 4);
      }

      // Draw priority indicator
      const priorityColor = getPriorityColor(task.priority);
      ctx.fillStyle = priorityColor;
      ctx.fillRect(barX - 8, barY, 4, barHeight);

      // Draw horizontal grid line
      ctx.strokeStyle = '#f3f4f6';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(leftMargin, y + rowHeight);
      ctx.lineTo(leftMargin + chartWidth, y + rowHeight);
      ctx.stroke();
    });

    // Draw dependencies
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    ganttTasks.forEach((task, taskIndex) => {
      task.dependencies.forEach(depId => {
        const depTaskIndex = ganttTasks.findIndex(t => t.id === depId);
        if (depTaskIndex !== -1) {
          const depTask = ganttTasks[depTaskIndex];
          
          // Calculate positions
          const depEndDays = Math.ceil((depTask.end.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          const taskStartDays = Math.ceil((task.start.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          
          const depX = leftMargin + (depEndDays * dayWidth);
          const depY = topMargin + (depTaskIndex * rowHeight) + (rowHeight / 2);
          const taskX = leftMargin + (taskStartDays * dayWidth);
          const taskY = topMargin + (taskIndex * rowHeight) + (rowHeight / 2);

          // Draw dependency line
          ctx.beginPath();
          ctx.moveTo(depX, depY);
          ctx.lineTo(depX + 10, depY);
          ctx.lineTo(depX + 10, taskY);
          ctx.lineTo(taskX - 5, taskY);
          ctx.stroke();

          // Draw arrow
          ctx.beginPath();
          ctx.moveTo(taskX - 5, taskY);
          ctx.lineTo(taskX - 10, taskY - 3);
          ctx.lineTo(taskX - 10, taskY + 3);
          ctx.closePath();
          ctx.fill();
        }
      });
    });

    // Draw legend
    const legendY = canvasHeight - 30;
    const legendItems = [
      { color: '#10b981', label: 'Completed' },
      { color: '#3b82f6', label: 'In Progress' },
      { color: '#f59e0b', label: 'On Hold' },
      { color: '#6b7280', label: 'Not Started' }
    ];

    let legendX = leftMargin;
    legendItems.forEach(item => {
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX, legendY, 15, 15);
      
      ctx.fillStyle = '#374151';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, legendX + 20, legendY + 12);
      
      legendX += 120;
    });
  };

  const getTimeScale = (start: Date, end: Date, mode: 'days' | 'weeks' | 'months') => {
    const timePoints = [];
    const current = new Date(start);
    const totalDuration = end.getTime() - start.getTime();

    while (current <= end) {
      const position = (current.getTime() - start.getTime()) / totalDuration;
      let label = '';

      switch (mode) {
        case 'days':
          label = current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          current.setDate(current.getDate() + 1);
          break;
        case 'weeks':
          label = `Week ${getWeekNumber(current)}`;
          current.setDate(current.getDate() + 7);
          break;
        case 'months':
          label = current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          current.setMonth(current.getMonth() + 1);
          break;
      }

      timePoints.push({ position, label });
    }

    return timePoints;
  };

  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const getTaskColor = (status: string, alpha: number = 1) => {
    const colors = {
      completed: `rgba(16, 185, 129, ${alpha})`,
      in_progress: `rgba(59, 130, 246, ${alpha})`,
      on_hold: `rgba(245, 158, 11, ${alpha})`,
      cancelled: `rgba(239, 68, 68, ${alpha})`,
      not_started: `rgba(107, 114, 128, ${alpha})`
    };
    return colors[status as keyof typeof colors] || colors.not_started;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: '#dc2626',
      high: '#ea580c',
      medium: '#d97706',
      low: '#65a30d'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const handleZoomIn = () => {
    const currentRange = endDate.getTime() - startDate.getTime();
    const newRange = currentRange * 0.8;
    const center = startDate.getTime() + currentRange / 2;
    
    setStartDate(new Date(center - newRange / 2));
    setEndDate(new Date(center + newRange / 2));
  };

  const handleZoomOut = () => {
    const currentRange = endDate.getTime() - startDate.getTime();
    const newRange = currentRange * 1.2;
    const center = startDate.getTime() + currentRange / 2;
    
    setStartDate(new Date(center - newRange / 2));
    setEndDate(new Date(center + newRange / 2));
  };

  const handleReset = () => {
    loadGanttData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Tasks
        </button>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gantt Chart</h1>
            <p className="mt-2 text-gray-600">Project: {projectName}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">View:</label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={handleZoomIn}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={handleReset}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Reset View"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Gantt Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Task Timeline</h2>
          <p className="text-sm text-gray-600">
            Showing {ganttTasks.length} tasks from {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
          </p>
        </div>
        
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full border border-gray-200 rounded-lg"
            style={{ height: Math.max(400, ganttTasks.length * 40 + 120) }}
          />
        </div>

        {ganttTasks.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">No tasks to display</p>
            <p className="text-gray-400 text-sm">Create tasks with planned dates to see the Gantt chart</p>
          </div>
        )}
      </div>

      {/* Task Summary */}
      {ganttTasks.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {ganttTasks.filter(t => t.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {ganttTasks.filter(t => t.status === 'in_progress').length}
              </p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {ganttTasks.filter(t => t.status === 'on_hold').length}
              </p>
              <p className="text-sm text-gray-600">On Hold</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">
                {ganttTasks.filter(t => t.status === 'not_started').length}
              </p>
              <p className="text-sm text-gray-600">Not Started</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GanttChartView;