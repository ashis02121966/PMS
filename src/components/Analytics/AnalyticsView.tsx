import React, { useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, DollarSign, Filter } from 'lucide-react';
import { Project } from '../../types/project';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsViewProps {
  projects: Project[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ projects }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('6weeks');
  const [selectedProject, setSelectedProject] = useState<string>('all');

  // Filter projects based on selection
  const filteredProjects = selectedProject === 'all' 
    ? projects 
    : projects.filter(p => p.id === selectedProject);

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

  // Status distribution data
  const statusDistribution = {
    labels: ['Green', 'Amber', 'Red'],
    datasets: [
      {
        data: [
          filteredProjects.filter(p => p.status === 'green').length,
          filteredProjects.filter(p => p.status === 'amber').length,
          filteredProjects.filter(p => p.status === 'red').length,
        ],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        borderWidth: 0,
      },
    ],
  };

  // Progress over time data
  const progressData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: filteredProjects.map((project, index) => ({
      label: project.name,
      data: project.weekly_progress?.slice(-6).map(w => w.progress) || [0, 0, 0, 0, 0, 0],
      borderColor: `hsl(${index * 60}, 70%, 50%)`,
      backgroundColor: `hsl(${index * 60}, 70%, 50%, 0.1)`,
      tension: 0.4,
    })),
  };

  // Issues trend data
  const issuesData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Issues Created',
        data: filteredProjects.reduce((acc, project) => {
          const weeklyData = project.weekly_progress?.slice(-6) || [];
          weeklyData.forEach((week, index) => {
            acc[index] = (acc[index] || 0) + week.issues_created;
          });
          return acc;
        }, [] as number[]),
        backgroundColor: '#EF4444',
        borderRadius: 4,
      },
      {
        label: 'Issues Resolved',
        data: filteredProjects.reduce((acc, project) => {
          const weeklyData = project.weekly_progress?.slice(-6) || [];
          weeklyData.forEach((week, index) => {
            acc[index] = (acc[index] || 0) + week.issues_resolved;
          });
          return acc;
        }, [] as number[]),
        backgroundColor: '#10B981',
        borderRadius: 4,
      },
    ],
  };

  // Financial overview
  const totalValue = filteredProjects.reduce((sum, p) => sum + p.project_value, 0);
  const completedValue = filteredProjects.reduce((sum, p) => {
    const completedMilestones = p.payment_milestones?.filter(m => m.status === 'completed') || [];
    return sum + completedMilestones.reduce((mSum, m) => mSum + m.amount, 0);
  }, 0);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="mt-2 text-gray-600">Comprehensive project performance and trend analysis</p>
      </div>

      {/* Project Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <label className="text-sm font-medium text-gray-700">Filter by Project:</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="6weeks">Last 6 Weeks</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="ml-2 text-sm font-medium text-green-600">12% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue Realized</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(completedValue)}</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="ml-2 text-sm font-medium text-green-600">8% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredProjects.length > 0 ? Math.round(filteredProjects.reduce((sum, p) => sum + p.progress, 0) / filteredProjects.length) : 0}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <span className="ml-2 text-sm font-medium text-red-600">3% from last week</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Issues</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredProjects.reduce((sum, p) => sum + (p.issues?.filter(i => i.status === 'open').length || 0), 0)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingDown className="h-4 w-4 text-green-500" />
            <span className="ml-2 text-sm font-medium text-green-600">15% from last week</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Project Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status Distribution</h3>
          <div className="h-64">
            <Doughnut data={statusDistribution} options={{ maintainAspectRatio: false }} />
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Green</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {filteredProjects.filter(p => p.status === 'green').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Amber</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {filteredProjects.filter(p => p.status === 'amber').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Red</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {filteredProjects.filter(p => p.status === 'red').length}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Trends */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Project Progress Trends</h3>
          </div>
          <div className="h-64">
            <Line data={progressData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Issues Analytics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues Trend Analysis</h3>
        <div className="h-64">
          <Bar data={issuesData} options={chartOptions} />
        </div>
      </div>

      {/* Project Health Drill-Down */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Health Drill-Down</h3>
        <div className="space-y-4">
          {['red', 'amber', 'green'].map((status) => {
            const statusProjects = filteredProjects.filter(p => p.status === status);
            const statusColor = status === 'red' ? 'text-red-600 bg-red-50' : 
                               status === 'amber' ? 'text-yellow-600 bg-yellow-50' : 
                               'text-green-600 bg-green-50';
            const borderColor = status === 'red' ? 'border-red-200' : 
                               status === 'amber' ? 'border-yellow-200' : 
                               'border-green-200';
            
            return (
              <div key={status} className={`p-4 rounded-lg border ${borderColor} ${statusColor}`}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium capitalize">{status} Status Projects ({statusProjects.length})</h4>
                  <span className="text-sm">
                    Avg Progress: {statusProjects.length > 0 ? Math.round(statusProjects.reduce((sum, p) => sum + p.progress, 0) / statusProjects.length) : 0}%
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {statusProjects.map((project) => (
                    <div key={project.id} className="bg-white p-3 rounded-lg border">
                      <h5 className="font-medium text-gray-900 text-sm">{project.name}</h5>
                      <p className="text-xs text-gray-600 mt-1">{project.progress}% complete</p>
                      <p className="text-xs text-gray-600">
                        {(project.issues?.filter(i => i.status === 'open').length || 0)} open issues
                      </p>
                      <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                        project.project_status === 'active' ? 'bg-green-100 text-green-800' :
                        project.project_status === 'hold' ? 'bg-yellow-100 text-yellow-800' :
                        project.project_status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.project_status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;