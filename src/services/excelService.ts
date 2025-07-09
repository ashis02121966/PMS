import { Project, Resource, PaymentMilestone, Issue, WeeklyProgress } from '../types/project';

export class ExcelService {
  private static readonly STORAGE_KEY = 'project_management_data';

  // Initialize with sample data if no data exists
  static initializeData(): void {
    const existingData = localStorage.getItem(this.STORAGE_KEY);
    if (!existingData) {
      const initialData = {
        projects: this.getSampleProjects(),
        lastId: 4
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
    }
  }

  static getData(): { projects: Project[], lastId: number } {
    this.initializeData();
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : { projects: [], lastId: 0 };
  }

  static saveData(projects: Project[], lastId: number): void {
    const data = { projects, lastId };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  static exportToCSV(): string {
    const { projects } = this.getData();
    
    const headers = [
      'Project ID', 'Project Name', 'Description', 'Start Date', 'End Date', 
      'Project Value', 'Currency', 'Status', 'Project Status', 'Progress',
      'Status Comment', 'Status Changed By', 'Status Changed At',
      'Created At', 'Updated At'
    ];

    let csv = headers.join(',') + '\n';
    
    projects.forEach(project => {
      const row = [
        project.id,
        `"${project.name}"`,
        `"${project.description}"`,
        project.start_date,
        project.end_date,
        project.project_value,
        project.currency,
        project.status,
        project.project_status,
        project.progress,
        `"${project.status_comment || ''}"`,
        `"${project.status_changed_by || ''}"`,
        project.status_changed_at || '',
        project.created_at,
        project.updated_at
      ];
      csv += row.join(',') + '\n';
    });

    return csv;
  }

  static exportProjectResourcesToCSV(projectId: string): string {
    const { projects } = this.getData();
    const project = projects.find(p => p.id === projectId);
    
    if (!project || !project.resources) return '';

    const headers = ['Resource ID', 'Project ID', 'Name', 'Role', 'Allocation', 'Hourly Rate', 'Created At'];
    let csv = headers.join(',') + '\n';
    
    project.resources.forEach(resource => {
      const row = [
        resource.id,
        resource.project_id,
        `"${resource.name}"`,
        `"${resource.role}"`,
        resource.allocation,
        resource.hourly_rate || 0,
        resource.created_at
      ];
      csv += row.join(',') + '\n';
    });

    return csv;
  }

  static exportProjectMilestonesToCSV(projectId: string): string {
    const { projects } = this.getData();
    const project = projects.find(p => p.id === projectId);
    
    if (!project || !project.payment_milestones) return '';

    const headers = ['Milestone ID', 'Project ID', 'Name', 'Amount', 'Due Date', 'Status', 'Completed Date', 'Created At'];
    let csv = headers.join(',') + '\n';
    
    project.payment_milestones.forEach(milestone => {
      const row = [
        milestone.id,
        milestone.project_id,
        `"${milestone.name}"`,
        milestone.amount,
        milestone.due_date,
        milestone.status,
        milestone.completed_date || '',
        milestone.created_at
      ];
      csv += row.join(',') + '\n';
    });

    return csv;
  }

  static exportProjectIssuesToCSV(projectId: string): string {
    const { projects } = this.getData();
    const project = projects.find(p => p.id === projectId);
    
    if (!project || !project.issues) return '';

    const headers = ['Issue ID', 'Project ID', 'Title', 'Description', 'Severity', 'Status', 'Assigned To', 'Category', 'Week Number', 'Year', 'Created At', 'Resolved At'];
    let csv = headers.join(',') + '\n';
    
    project.issues.forEach(issue => {
      const row = [
        issue.id,
        issue.project_id,
        `"${issue.title}"`,
        `"${issue.description || ''}"`,
        issue.severity,
        issue.status,
        `"${issue.assigned_to || ''}"`,
        issue.category,
        issue.week_number || '',
        issue.year || '',
        issue.created_at,
        issue.resolved_at || ''
      ];
      csv += row.join(',') + '\n';
    });

    return csv;
  }

  static downloadFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private static getSampleProjects(): Project[] {
    return [
      {
        id: '1',
        name: 'E-commerce Platform Redesign',
        description: 'Complete overhaul of the existing e-commerce platform with modern UI/UX',
        start_date: '2024-01-15',
        end_date: '2024-06-30',
        project_value: 20750000,
        currency: 'INR',
        status: 'green',
        project_status: 'active',
        progress: 75,
        resources: [
          { id: '1', project_id: '1', name: 'Rajesh Kumar', role: 'Project Manager', allocation: 100, created_at: '2024-01-15T00:00:00Z' },
          { id: '2', project_id: '1', name: 'Priya Sharma', role: 'Frontend Developer', allocation: 80, created_at: '2024-01-15T00:00:00Z' },
          { id: '3', project_id: '1', name: 'Amit Patel', role: 'Backend Developer', allocation: 90, created_at: '2024-01-15T00:00:00Z' }
        ],
        payment_milestones: [
          { id: '1', project_id: '1', name: 'Project Kickoff', amount: 4150000, due_date: '2024-02-01', status: 'completed', completed_date: '2024-01-30', created_at: '2024-01-15T00:00:00Z' },
          { id: '2', project_id: '1', name: 'Phase 1 Completion', amount: 6225000, due_date: '2024-03-15', status: 'completed', completed_date: '2024-03-10', created_at: '2024-01-15T00:00:00Z' },
          { id: '3', project_id: '1', name: 'Phase 2 Completion', amount: 6225000, due_date: '2024-05-01', status: 'completed', completed_date: '2024-04-28', created_at: '2024-01-15T00:00:00Z' },
          { id: '4', project_id: '1', name: 'Final Delivery', amount: 4150000, due_date: '2024-06-30', status: 'pending', created_at: '2024-01-15T00:00:00Z' }
        ],
        issues: [
          { id: '1', project_id: '1', title: 'Payment gateway integration issues', description: 'Issues with Razorpay API integration', severity: 'high', status: 'resolved', assigned_to: 'Amit Patel', created_at: '2024-03-20T00:00:00Z', resolved_at: '2024-03-25T00:00:00Z', category: 'bug', week_number: 12, year: 2024 },
          { id: '2', project_id: '1', title: 'Mobile responsiveness fixes', description: 'Cart page not responsive on mobile devices', severity: 'medium', status: 'in-progress', assigned_to: 'Priya Sharma', created_at: '2024-04-10T00:00:00Z', category: 'bug', week_number: 15, year: 2024 }
        ],
        weekly_progress: [
          { id: 'wp1', project_id: '1', week_number: 10, year: 2024, progress: 10, issues_resolved: 0, issues_created: 1, milestones_completed: 1, created_at: '2024-03-04T00:00:00Z' },
          { id: 'wp2', project_id: '1', week_number: 11, year: 2024, progress: 25, issues_resolved: 0, issues_created: 0, milestones_completed: 0, created_at: '2024-03-11T00:00:00Z' },
          { id: 'wp3', project_id: '1', week_number: 12, year: 2024, progress: 40, issues_resolved: 1, issues_created: 1, milestones_completed: 1, created_at: '2024-03-18T00:00:00Z' },
          { id: 'wp4', project_id: '1', week_number: 13, year: 2024, progress: 55, issues_resolved: 0, issues_created: 0, milestones_completed: 0, created_at: '2024-03-25T00:00:00Z' },
          { id: 'wp5', project_id: '1', week_number: 14, year: 2024, progress: 70, issues_resolved: 1, issues_created: 0, milestones_completed: 1, created_at: '2024-04-01T00:00:00Z' },
          { id: 'wp6', project_id: '1', week_number: 15, year: 2024, progress: 75, issues_resolved: 0, issues_created: 0, milestones_completed: 0, created_at: '2024-04-08T00:00:00Z' }
        ],
        created_at: '2024-01-10T00:00:00Z',
        updated_at: '2024-04-15T00:00:00Z'
      },
      {
        id: '2',
        name: 'Customer Portal Development',
        description: 'Self-service customer portal with account management features',
        start_date: '2024-02-01',
        end_date: '2024-07-15',
        project_value: 14940000,
        currency: 'INR',
        status: 'amber',
        project_status: 'active',
        progress: 45,
        resources: [
          { id: '4', project_id: '2', name: 'Sarah Wilson', role: 'Lead Developer', allocation: 100, created_at: '2024-02-01T00:00:00Z' },
          { id: '5', project_id: '2', name: 'Tom Brown', role: 'UI/UX Designer', allocation: 60, created_at: '2024-02-01T00:00:00Z' },
          { id: '6', project_id: '2', name: 'Lisa Chen', role: 'QA Engineer', allocation: 70, created_at: '2024-02-01T00:00:00Z' }
        ],
        payment_milestones: [
          { id: '5', project_id: '2', name: 'Discovery Phase', amount: 2490000, due_date: '2024-02-15', status: 'completed', completed_date: '2024-02-12', created_at: '2024-02-01T00:00:00Z' },
          { id: '6', project_id: '2', name: 'Design Approval', amount: 3735000, due_date: '2024-03-30', status: 'completed', completed_date: '2024-04-02', created_at: '2024-02-01T00:00:00Z' },
          { id: '7', project_id: '2', name: 'Development Phase 1', amount: 4980000, due_date: '2024-05-15', status: 'overdue', created_at: '2024-02-01T00:00:00Z' },
          { id: '8', project_id: '2', name: 'Final Delivery', amount: 3735000, due_date: '2024-07-15', status: 'pending', created_at: '2024-02-01T00:00:00Z' }
        ],
        issues: [
          { id: '3', project_id: '2', title: 'Database performance optimization', description: 'Slow query performance on user dashboard', severity: 'high', status: 'open', assigned_to: 'Sarah Wilson', created_at: '2024-04-08T00:00:00Z', category: 'bug', week_number: 15, year: 2024 },
          { id: '4', project_id: '2', title: 'Authentication system enhancement', description: 'Add two-factor authentication', severity: 'medium', status: 'in-progress', assigned_to: 'Sarah Wilson', created_at: '2024-03-25T00:00:00Z', category: 'feature', week_number: 13, year: 2024 },
          { id: '5', project_id: '2', title: 'UI inconsistencies', description: 'Button styles not consistent across pages', severity: 'low', status: 'open', assigned_to: 'Tom Brown', created_at: '2024-04-12T00:00:00Z', category: 'improvement', week_number: 15, year: 2024 }
        ],
        weekly_progress: [
          { id: 'wp7', project_id: '2', week_number: 10, year: 2024, progress: 8, issues_resolved: 0, issues_created: 0, milestones_completed: 1, created_at: '2024-03-04T00:00:00Z' },
          { id: 'wp8', project_id: '2', week_number: 11, year: 2024, progress: 15, issues_resolved: 0, issues_created: 1, milestones_completed: 0, created_at: '2024-03-11T00:00:00Z' },
          { id: 'wp9', project_id: '2', week_number: 12, year: 2024, progress: 28, issues_resolved: 0, issues_created: 2, milestones_completed: 1, created_at: '2024-03-18T00:00:00Z' },
          { id: 'wp10', project_id: '2', week_number: 13, year: 2024, progress: 35, issues_resolved: 0, issues_created: 0, milestones_completed: 0, created_at: '2024-03-25T00:00:00Z' },
          { id: 'wp11', project_id: '2', week_number: 14, year: 2024, progress: 42, issues_resolved: 1, issues_created: 1, milestones_completed: 0, created_at: '2024-04-01T00:00:00Z' },
          { id: 'wp12', project_id: '2', week_number: 15, year: 2024, progress: 45, issues_resolved: 0, issues_created: 0, milestones_completed: 0, created_at: '2024-04-08T00:00:00Z' }
        ],
        created_at: '2024-01-25T00:00:00Z',
        updated_at: '2024-04-15T00:00:00Z'
      },
      {
        id: '3',
        name: 'Mobile App Development',
        description: 'Native mobile application for iOS and Android platforms',
        start_date: '2024-03-01',
        end_date: '2024-09-30',
        project_value: 26560000,
        currency: 'INR',
        status: 'red',
        project_status: 'hold',
        progress: 20,
        status_comment: 'Project on hold due to budget constraints and resource reallocation',
        status_changed_at: '2024-04-10T00:00:00Z',
        status_changed_by: 'Project Manager',
        resources: [
          { id: '7', project_id: '3', name: 'David Lee', role: 'Mobile Developer', allocation: 100, created_at: '2024-03-01T00:00:00Z' },
          { id: '8', project_id: '3', name: 'Emma Davis', role: 'Mobile Developer', allocation: 100, created_at: '2024-03-01T00:00:00Z' },
          { id: '9', project_id: '3', name: 'Alex Rodriguez', role: 'Backend Developer', allocation: 50, created_at: '2024-03-01T00:00:00Z' }
        ],
        payment_milestones: [
          { id: '9', project_id: '3', name: 'Project Setup', amount: 4150000, due_date: '2024-03-15', status: 'completed', completed_date: '2024-03-12', created_at: '2024-03-01T00:00:00Z' },
          { id: '10', project_id: '3', name: 'MVP Development', amount: 8300000, due_date: '2024-05-01', status: 'overdue', created_at: '2024-03-01T00:00:00Z' },
          { id: '11', project_id: '3', name: 'Beta Testing', amount: 8300000, due_date: '2024-07-15', status: 'pending', created_at: '2024-03-01T00:00:00Z' },
          { id: '12', project_id: '3', name: 'App Store Release', amount: 5810000, due_date: '2024-09-30', status: 'pending', created_at: '2024-03-01T00:00:00Z' }
        ],
        issues: [
          { id: '6', project_id: '3', title: 'Critical app crash on startup', description: 'App crashes when launched on iOS 17', severity: 'critical', status: 'open', assigned_to: 'David Lee', created_at: '2024-04-05T00:00:00Z', category: 'bug', week_number: 14, year: 2024 },
          { id: '7', project_id: '3', title: 'Push notification system', description: 'Implement push notification service', severity: 'high', status: 'open', assigned_to: 'Alex Rodriguez', created_at: '2024-03-30T00:00:00Z', category: 'feature', week_number: 13, year: 2024 },
          { id: '8', project_id: '3', title: 'Performance optimization needed', description: 'App loading time is too slow', severity: 'medium', status: 'in-progress', assigned_to: 'Emma Davis', created_at: '2024-04-01T00:00:00Z', category: 'improvement', week_number: 14, year: 2024 }
        ],
        weekly_progress: [
          { id: 'wp13', project_id: '3', week_number: 10, year: 2024, progress: 5, issues_resolved: 0, issues_created: 0, milestones_completed: 1, created_at: '2024-03-04T00:00:00Z' },
          { id: 'wp14', project_id: '3', week_number: 11, year: 2024, progress: 8, issues_resolved: 0, issues_created: 1, milestones_completed: 0, created_at: '2024-03-11T00:00:00Z' },
          { id: 'wp15', project_id: '3', week_number: 12, year: 2024, progress: 12, issues_resolved: 0, issues_created: 2, milestones_completed: 0, created_at: '2024-03-18T00:00:00Z' },
          { id: 'wp16', project_id: '3', week_number: 13, year: 2024, progress: 15, issues_resolved: 0, issues_created: 1, milestones_completed: 0, created_at: '2024-03-25T00:00:00Z' },
          { id: 'wp17', project_id: '3', week_number: 14, year: 2024, progress: 18, issues_resolved: 0, issues_created: 0, milestones_completed: 0, created_at: '2024-04-01T00:00:00Z' },
          { id: 'wp18', project_id: '3', week_number: 15, year: 2024, progress: 20, issues_resolved: 0, issues_created: 0, milestones_completed: 0, created_at: '2024-04-08T00:00:00Z' }
        ],
        created_at: '2024-02-20T00:00:00Z',
        updated_at: '2024-04-15T00:00:00Z'
      },
      {
        id: '4',
        name: 'Legacy System Migration',
        description: 'Migration of legacy banking system to modern cloud infrastructure',
        start_date: '2023-09-01',
        end_date: '2024-03-31',
        project_value: 41500000,
        currency: 'INR',
        status: 'green',
        project_status: 'completed',
        progress: 100,
        status_comment: 'Project completed successfully with all deliverables met',
        status_changed_at: '2024-03-31T00:00:00Z',
        status_changed_by: 'Project Director',
        resources: [
          { id: '10', project_id: '4', name: 'Rajesh Kumar', role: 'Technical Lead', allocation: 100, created_at: '2023-09-01T00:00:00Z' },
          { id: '11', project_id: '4', name: 'Priya Sharma', role: 'System Architect', allocation: 90, created_at: '2023-09-01T00:00:00Z' },
          { id: '12', project_id: '4', name: 'Amit Patel', role: 'DevOps Engineer', allocation: 80, created_at: '2023-09-01T00:00:00Z' }
        ],
        payment_milestones: [
          { id: '13', project_id: '4', name: 'System Analysis', amount: 8300000, due_date: '2023-10-15', status: 'completed', completed_date: '2023-10-12', created_at: '2023-09-01T00:00:00Z' },
          { id: '14', project_id: '4', name: 'Infrastructure Setup', amount: 12450000, due_date: '2023-12-31', status: 'completed', completed_date: '2023-12-28', created_at: '2023-09-01T00:00:00Z' },
          { id: '15', project_id: '4', name: 'Data Migration', amount: 12450000, due_date: '2024-02-29', status: 'completed', completed_date: '2024-02-25', created_at: '2023-09-01T00:00:00Z' },
          { id: '16', project_id: '4', name: 'Go-Live & Support', amount: 8300000, due_date: '2024-03-31', status: 'completed', completed_date: '2024-03-31', created_at: '2023-09-01T00:00:00Z' }
        ],
        issues: [
          { id: '9', project_id: '4', title: 'Data validation errors', description: 'Some legacy data formats causing validation issues', severity: 'medium', status: 'resolved', assigned_to: 'Priya Sharma', created_at: '2024-01-15T00:00:00Z', resolved_at: '2024-01-22T00:00:00Z', category: 'bug', week_number: 3, year: 2024 },
          { id: '10', project_id: '4', title: 'Performance optimization', description: 'System performance tuning for better response times', severity: 'low', status: 'resolved', assigned_to: 'Amit Patel', created_at: '2024-02-10T00:00:00Z', resolved_at: '2024-02-18T00:00:00Z', category: 'improvement', week_number: 6, year: 2024 }
        ],
        weekly_progress: [
          { id: 'wp19', project_id: '4', week_number: 1, year: 2024, progress: 85, issues_resolved: 0, issues_created: 1, milestones_completed: 0, created_at: '2024-01-08T00:00:00Z' },
          { id: 'wp20', project_id: '4', week_number: 2, year: 2024, progress: 88, issues_resolved: 1, issues_created: 0, milestones_completed: 0, created_at: '2024-01-15T00:00:00Z' },
          { id: 'wp21', project_id: '4', week_number: 3, year: 2024, progress: 92, issues_resolved: 0, issues_created: 1, milestones_completed: 1, created_at: '2024-01-22T00:00:00Z' },
          { id: 'wp22', project_id: '4', week_number: 4, year: 2024, progress: 95, issues_resolved: 1, issues_created: 0, milestones_completed: 0, created_at: '2024-01-29T00:00:00Z' },
          { id: 'wp23', project_id: '4', week_number: 5, year: 2024, progress: 98, issues_resolved: 0, issues_created: 0, milestones_completed: 0, created_at: '2024-02-05T00:00:00Z' },
          { id: 'wp24', project_id: '4', week_number: 6, year: 2024, progress: 100, issues_resolved: 0, issues_created: 0, milestones_completed: 1, created_at: '2024-02-12T00:00:00Z' }
        ],
        created_at: '2023-08-25T00:00:00Z',
        updated_at: '2024-03-31T00:00:00Z'
      }
    ];
  }
}