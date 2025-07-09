import React, { useState } from 'react';
import { Upload, Calendar, DollarSign, Users, Plus, X, FileSpreadsheet, Download, ArrowLeft } from 'lucide-react';
import { Project, Resource, PaymentMilestone } from '../../types/project';
import { TemplateGenerator } from '../../utils/templateGenerator';

interface CreateProjectViewProps {
  onProjectCreate: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const CreateProjectView: React.FC<CreateProjectViewProps> = ({ onProjectCreate, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    project_value: 0,
    currency: 'INR',
    status: 'green' as const,
    project_status: 'active' as const,
    progress: 0,
  });

  const [resources, setResources] = useState<Omit<Resource, 'id' | 'project_id' | 'created_at'>[]>([]);
  const [milestones, setMilestones] = useState<Omit<PaymentMilestone, 'id' | 'project_id' | 'created_at'>[]>([]);
  const [showExcelUpload, setShowExcelUpload] = useState(false);

  const addResource = () => {
    setResources([...resources, { name: '', role: '', allocation: 100, hourly_rate: 0 }]);
  };

  const updateResource = (index: number, field: keyof Omit<Resource, 'id' | 'project_id' | 'created_at'>, value: string | number) => {
    const updated = [...resources];
    if (field === 'allocation' || field === 'hourly_rate') {
      updated[index] = { ...updated[index], [field]: Number(value) || 0 };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setResources(updated);
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const addMilestone = () => {
    setMilestones([...milestones, { name: '', amount: 0, due_date: '', status: 'pending', completed_date: null }]);
  };

  const updateMilestone = (index: number, field: keyof Omit<PaymentMilestone, 'id' | 'project_id' | 'created_at'>, value: string | number) => {
    const updated = [...milestones];
    if (field === 'amount') {
      updated[index] = { ...updated[index], [field]: Number(value) || 0 };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setMilestones(updated);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          alert('File must contain at least a header row and one data row');
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
        const values = lines[1].split(',').map(v => v.trim().replace(/^"|"$/g, ''));

        // Parse project data
        const projectNameIndex = headers.findIndex(h => h.includes('project name'));
        const descriptionIndex = headers.findIndex(h => h.includes('description'));
        const startDateIndex = headers.findIndex(h => h.includes('start date'));
        const endDateIndex = headers.findIndex(h => h.includes('end date'));
        const valueIndex = headers.findIndex(h => h.includes('project value'));
        const currencyIndex = headers.findIndex(h => h.includes('currency'));
        const statusIndex = headers.findIndex(h => h.includes('status') && !h.includes('project status'));
        const projectStatusIndex = headers.findIndex(h => h.includes('project status'));
        const progressIndex = headers.findIndex(h => h.includes('progress'));

        if (projectNameIndex >= 0 && values[projectNameIndex]) {
          setProjectData({
            name: values[projectNameIndex] || '',
            description: values[descriptionIndex] || '',
            start_date: values[startDateIndex] || '',
            end_date: values[endDateIndex] || '',
            project_value: parseInt(values[valueIndex]) || 0,
            currency: values[currencyIndex] || 'INR',
            status: (values[statusIndex] as any) || 'green',
            project_status: (values[projectStatusIndex] as any) || 'active',
            progress: parseInt(values[progressIndex]) || 0,
          });
        }

        // Parse resources
        const newResources: Omit<Resource, 'id' | 'project_id' | 'created_at'>[] = [];
        for (let i = 1; i <= 3; i++) {
          const nameIndex = headers.findIndex(h => h.includes(`resource name ${i}`));
          const roleIndex = headers.findIndex(h => h.includes(`resource role ${i}`));
          const allocationIndex = headers.findIndex(h => h.includes(`resource allocation ${i}`));
          
          if (nameIndex >= 0 && values[nameIndex]) {
            newResources.push({
              name: values[nameIndex] || '',
              role: values[roleIndex] || '',
              allocation: parseInt(values[allocationIndex]) || 100
            });
          }
        }
        setResources(newResources);

        // Parse milestones
        const newMilestones: Omit<PaymentMilestone, 'id' | 'project_id' | 'created_at'>[] = [];
        for (let i = 1; i <= 3; i++) {
          const nameIndex = headers.findIndex(h => h.includes(`milestone ${i} name`));
          const amountIndex = headers.findIndex(h => h.includes(`milestone ${i} amount`));
          const dueDateIndex = headers.findIndex(h => h.includes(`milestone ${i} due date`));
          const statusIndex = headers.findIndex(h => h.includes(`milestone ${i} status`));
          
          if (nameIndex >= 0 && values[nameIndex]) {
            newMilestones.push({
              name: values[nameIndex] || '',
              amount: parseInt(values[amountIndex]) || 0,
              due_date: values[dueDateIndex] || '',
              status: (values[statusIndex] as any) || 'pending'
            });
          }
        }
        setMilestones(newMilestones);

        setShowExcelUpload(false);
        alert('Project data imported successfully from Excel!');
      } catch (error) {
        console.error('Error parsing file:', error);
        alert('Error parsing file. Please check the format and try again.');
      }
    }
    // Reset file input
    event.target.value = '';
  };

  const downloadTemplate = () => {
    const templateContent = TemplateGenerator.generateProjectTemplate();
    TemplateGenerator.downloadFile(templateContent, 'project_template.csv');
  };

  const handleSubmit = () => {
    console.log('Submitting project with data:', {
      projectData,
      resources,
      milestones
    });
    
    // Validate required fields
    if (!projectData.name || !projectData.description || !projectData.start_date || !projectData.end_date) {
      alert('Please fill in all required project fields');
      return;
    }
    
    if (projectData.project_value <= 0) {
      alert('Project value must be greater than 0');
      return;
    }
    
    // Validate resources
    if (resources.length > 0) {
      for (const resource of resources) {
        if (!resource.name || !resource.role) {
          alert('Please fill in all resource fields (name and role are required)');
          return;
        }
        if (resource.allocation < 0 || resource.allocation > 100) {
          alert('Resource allocation must be between 0 and 100');
          return;
        }
      }
    }
    
    // Validate milestones
    if (milestones.length > 0) {
      for (const milestone of milestones) {
        if (!milestone.name || !milestone.due_date) {
          alert('Please fill in all milestone fields (name and due date are required)');
          return;
        }
        if (milestone.amount <= 0) {
          alert('Milestone amount must be greater than 0');
          return;
        }
      }
    }
    
    const newProject = {
      ...projectData,
      resources: resources.length > 0 ? resources : undefined,
      payment_milestones: milestones.length > 0 ? milestones : undefined,
      issues: undefined,
      weekly_progress: undefined
    };

    console.log('Final project object:', newProject);
    onProjectCreate(newProject);
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return projectData.name && projectData.description && projectData.start_date && projectData.end_date && projectData.project_value > 0;
      case 2:
        return resources.length > 0 && resources.every(r => r.name && r.role);
      case 3:
        return milestones.length > 0 && milestones.every(m => m.name && m.amount > 0 && m.due_date);
      default:
        return false;
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={onCancel}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Projects
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
        <p className="mt-2 text-gray-600">Set up a new project with all necessary details and milestones</p>
      </div>

      {/* CSV Upload Option */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileSpreadsheet className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Import from Excel/CSV</h3>
              <p className="text-blue-700">Upload a CSV file to automatically populate project data from Excel</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={downloadTemplate}
              className="flex items-center px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </button>
            <button
              onClick={() => setShowExcelUpload(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload CSV
            </button>
          </div>
        </div>

        {showExcelUpload && (
          <div className="mt-4 pt-4 border-t border-blue-200">
            <input
              type="file"
              accept=".csv"
              onChange={handleExcelUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-2 text-sm text-blue-600">
              Select a CSV file exported from Excel containing project data. Use the template above for the correct format.
            </p>
            <button
              onClick={() => setShowExcelUpload(false)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Cancel Upload
            </button>
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <nav className="flex items-center justify-center">
          <ol className="flex items-center space-x-5">
            {[
              { number: 1, name: 'Project Details' },
              { number: 2, name: 'Resources' },
              { number: 3, name: 'Milestones' },
              { number: 4, name: 'Review' }
            ].map((step) => (
              <li key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {step.number}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
                {step.number < 4 && (
                  <div className={`ml-5 w-5 h-0.5 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Project Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  value={projectData.name}
                  onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter project name"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={projectData.description}
                  onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter project description"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Value (₹)</label>
                <input
                  type="number"
                  value={projectData.project_value}
                  onChange={(e) => setProjectData({ ...projectData, project_value: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
                {projectData.project_value > 0 && (
                  <p className="mt-1 text-sm text-gray-600">
                    {formatCurrency(projectData.project_value)}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={projectData.currency}
                  onChange={(e) => setProjectData({ ...projectData, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
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
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
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
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
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
              {resources.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No resources added yet. Click "Add Resource" to get started.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
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
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
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
                    onChange={(e) => updateMilestone(index, 'amount', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Amount (₹)"
                    min="0"
                  />
                  <input
                    type="date"
                    value={milestone.due_date}
                    onChange={(e) => updateMilestone(index, 'due_date', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={() => removeMilestone(index)}
                    className="flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {milestones.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No milestones added yet. Click "Add Milestone" to get started.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Review Project</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Project Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><span className="font-medium">Name:</span> {projectData.name}</p>
                    <p><span className="font-medium">Description:</span> {projectData.description}</p>
                    <p><span className="font-medium">Duration:</span> {projectData.start_date} to {projectData.end_date}</p>
                    <p><span className="font-medium">Value:</span> {formatCurrency(projectData.project_value)}</p>
                    <p><span className="font-medium">Status:</span> {projectData.project_status}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Resources ({resources.length})</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    {resources.map((resource, index) => (
                      <p key={index}>{resource.name} - {resource.role} ({resource.allocation}%)</p>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Milestones ({milestones.length})</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {milestones.map((milestone, index) => (
                    <p key={index}>{milestone.name} - {formatCurrency(milestone.amount)} ({milestone.due_date})</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!isStepValid(currentStep)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Create Project
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProjectView;