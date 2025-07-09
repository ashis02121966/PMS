import React, { useState, useEffect } from 'react';
import Header from './components/Layout/Header';
import DashboardView from './components/Dashboard/DashboardView';
import ProjectsView from './components/Projects/ProjectsView';
import AnalyticsView from './components/Analytics/AnalyticsView';
import ProjectDetailView from './components/Projects/ProjectDetailView';
import CreateProjectView from './components/Projects/CreateProjectView';
import EditProjectView from './components/Projects/EditProjectView';
import UploadIssuesView from './components/Issues/UploadIssuesView';
import { ProjectService } from './services/projectService';
import { Project } from './types/project';
import { testConnection } from './lib/supabase';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      
      // Test Supabase connection first
      console.log('Testing Supabase connection...');
      const connectionOk = await testConnection();
      if (!connectionOk) {
        throw new Error('Failed to connect to database. Please check your Supabase configuration.');
      }
      
      // Load projects
      await loadProjects();
    } catch (err) {
      console.error('App initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize application');
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      console.log('Loading projects...');
      const data = await ProjectService.getAllProjects();
      console.log('Projects loaded:', data.length);
      setProjects(data);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error loading projects:', err);
      throw err; // Re-throw to be handled by caller
    }
  };

  const handleProjectCreate = async (newProject: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('App: Creating project with data:', newProject);
      setLoading(true);
      await ProjectService.createProject(newProject);
      await loadProjects();
      setCurrentView('projects');
      alert('Project created successfully!');
    } catch (err) {
      console.error('App: Error creating project:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      alert(`Error creating project: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    setSelectedProject(null);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('project-detail');
  };

  const handleProjectUpdate = async (updatedProject: Project) => {
    try {
      console.log('App: Updating project:', updatedProject.id);
      await ProjectService.updateProject(updatedProject.id, updatedProject);
      await loadProjects();
      setSelectedProject(updatedProject);
      alert('Project updated successfully!');
    } catch (err) {
      console.error('App: Error updating project:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project';
      setError(errorMessage);
      alert(`Error updating project: ${errorMessage}`);
    }
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('edit-project');
  };

  const handleIssuesUploaded = () => {
    loadProjects(); // Refresh projects to show new issues
  };

  const handleStatusDrillDown = (status: 'green' | 'amber' | 'red') => {
    // Filter projects by status and navigate to projects view
    setCurrentView('projects');
    // You could add a filter state here to show only projects with the selected status
  };

  const handleViewAllProjects = () => {
    setCurrentView('projects');
  };

  const renderCurrentView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={loadProjects}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView 
            projects={projects} 
            onProjectClick={handleProjectClick}
            onStatusDrillDown={handleStatusDrillDown}
            onViewAllProjects={handleViewAllProjects}
          />
        );
      case 'projects':
        return <ProjectsView projects={projects} onProjectClick={handleProjectClick} onCreateProject={() => setCurrentView('create')} />;
      case 'analytics':
        return <AnalyticsView projects={projects} />;
      case 'upload-issues':
        return <UploadIssuesView projects={projects} onBack={() => setCurrentView('dashboard')} onIssuesUploaded={handleIssuesUploaded} />;
      case 'create':
        return <CreateProjectView onProjectCreate={handleProjectCreate} onCancel={() => setCurrentView('projects')} />;
      case 'edit-project':
        return selectedProject ? (
          <EditProjectView 
            project={selectedProject} 
            onProjectUpdate={handleProjectUpdate}
            onCancel={() => setCurrentView('project-detail')}
          />
        ) : <DashboardView projects={projects} onProjectClick={handleProjectClick} onViewAllProjects={handleViewAllProjects} />;
      case 'project-detail':
        return selectedProject ? (
          <ProjectDetailView 
            project={selectedProject} 
            onProjectUpdate={handleProjectUpdate}
            onEditProject={handleEditProject}
            onBack={() => setCurrentView('projects')}
          />
        ) : <DashboardView projects={projects} onProjectClick={handleProjectClick} onViewAllProjects={handleViewAllProjects} />;
      default:
        return <DashboardView projects={projects} onProjectClick={handleProjectClick} onViewAllProjects={handleViewAllProjects} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={handleViewChange} />
      <main className="pb-8">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;