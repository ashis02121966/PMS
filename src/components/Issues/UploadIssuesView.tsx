import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, X, ArrowLeft } from 'lucide-react';
import { Project, Issue } from '../../types/project';
import { ProjectService } from '../../services/projectService';

interface UploadIssuesViewProps {
  projects: Project[];
  onBack: () => void;
  onIssuesUploaded: () => void;
}

const UploadIssuesView: React.FC<UploadIssuesViewProps> = ({ projects, onBack, onIssuesUploaded }) => {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadedIssues, setUploadedIssues] = useState<Issue[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedProject) {
      setUploadStatus('error');
      setUploadMessage('Please select a project and file');
      return;
    }

    setUploadStatus('uploading');
    setUploadMessage('Processing file...');

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('File must contain at least a header row and one data row');
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const requiredHeaders = ['title', 'description', 'severity', 'assigned_to', 'category'];
      
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
      }

      const issues: Omit<Issue, 'id' | 'created_at'>[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        
        if (values.length !== headers.length) {
          console.warn(`Skipping row ${i + 1}: column count mismatch`);
          continue;
        }

        const issue: Omit<Issue, 'id' | 'created_at'> = {
          project_id: selectedProject,
          title: values[headers.indexOf('title')] || '',
          description: values[headers.indexOf('description')] || '',
          severity: (values[headers.indexOf('severity')] as any) || 'medium',
          assigned_to: values[headers.indexOf('assigned_to')] || '',
          category: (values[headers.indexOf('category')] as any) || 'bug',
          status: 'open'
        };

        if (issue.title) {
          issues.push(issue);
        }
      }

      if (issues.length === 0) {
        throw new Error('No valid issues found in the file');
      }

      const createdIssues = await ProjectService.bulkCreateIssues(issues);
      setUploadedIssues(createdIssues);
      setUploadStatus('success');
      setUploadMessage(`Successfully uploaded ${createdIssues.length} issues`);
      onIssuesUploaded();

    } catch (error) {
      setUploadStatus('error');
      setUploadMessage(error instanceof Error ? error.message : 'Failed to upload issues');
    }

    // Reset file input
    event.target.value = '';
  };

  const downloadIssuesTemplate = () => {
    const csvContent = 'title,description,severity,assigned_to,category\n' +
      '"Sample Issue Title","Description of the issue","high","John Doe","bug"\n' +
      '"Another Issue","Another description","medium","Jane Smith","feature"';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'issues_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const downloadProjectIssues = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project || !project.issues || project.issues.length === 0) {
      alert('No issues found for this project');
      return;
    }

    const headers = 'title,description,severity,status,assigned_to,category,created_at,resolved_at\n';
    const csvContent = headers + project.issues.map(issue => 
      `"${issue.title}","${issue.description || ''}","${issue.severity}","${issue.status}","${issue.assigned_to || ''}","${issue.category}","${issue.created_at}","${issue.resolved_at || ''}"`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/[^a-zA-Z0-9]/g, '_')}_issues.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const resetUploadStatus = () => {
    setUploadStatus('idle');
    setUploadMessage('');
    setUploadedIssues([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Upload Issues</h1>
        <p className="mt-2 text-gray-600">Upload issues in bulk for your projects using CSV files</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center mb-6">
          <Upload className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Upload Issues</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a project...</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="flex flex-col items-center space-y-4">
                <div>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose CSV File
                    </span>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      disabled={!selectedProject || uploadStatus === 'uploading'}
                      className="hidden"
                    />
                  </label>
                </div>
                <button
                  onClick={downloadIssuesTemplate}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </button>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Upload a CSV file with columns: title, description, severity, assigned_to, category
              </p>
            </div>
          </div>

          {/* Upload Status */}
          {uploadStatus !== 'idle' && (
            <div className={`p-4 rounded-lg border ${
              uploadStatus === 'uploading' ? 'bg-blue-50 border-blue-200' :
              uploadStatus === 'success' ? 'bg-green-50 border-green-200' :
              'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {uploadStatus === 'uploading' && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                  )}
                  {uploadStatus === 'success' && <CheckCircle className="h-5 w-5 text-green-600 mr-3" />}
                  {uploadStatus === 'error' && <AlertCircle className="h-5 w-5 text-red-600 mr-3" />}
                  <span className={`font-medium ${
                    uploadStatus === 'uploading' ? 'text-blue-800' :
                    uploadStatus === 'success' ? 'text-green-800' :
                    'text-red-800'
                  }`}>
                    {uploadMessage}
                  </span>
                </div>
                {uploadStatus !== 'uploading' && (
                  <button
                    onClick={resetUploadStatus}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {uploadStatus === 'success' && uploadedIssues.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-green-800 mb-2">Uploaded Issues:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {uploadedIssues.map((issue, index) => (
                      <div key={index} className="text-sm text-green-700 bg-green-100 p-2 rounded">
                        <strong>{issue.title}</strong> - {issue.severity} - {issue.category}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Download Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Download className="h-6 w-6 text-green-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Download Project Issues</h2>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">Download existing issues for any project as a CSV file.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-600">
                      {project.issues?.length || 0} issues
                    </p>
                  </div>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'green' ? 'bg-green-100 text-green-800' :
                    project.status === 'amber' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <button
                  onClick={() => downloadProjectIssues(project.id)}
                  disabled={!project.issues || project.issues.length === 0}
                  className="w-full flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Issues
                </button>
              </div>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No projects available for download.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadIssuesView;