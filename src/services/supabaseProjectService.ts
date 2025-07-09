import { supabase } from '../lib/supabase';
import { Project, Resource, PaymentMilestone, Issue, WeeklyProgress, ProjectStatusChange, Task } from '../types/project';
import { Database } from '../types/database';

type ProjectRow = Database['public']['Tables']['projects']['Row'];
type ResourceRow = Database['public']['Tables']['resources']['Row'];
type PaymentMilestoneRow = Database['public']['Tables']['payment_milestones']['Row'];
type IssueRow = Database['public']['Tables']['issues']['Row'];
type WeeklyProgressRow = Database['public']['Tables']['weekly_progress']['Row'];
type TaskRow = Database['public']['Tables']['tasks']['Row'];

export class SupabaseProjectService {
  // Helper function to convert database row to Project type
  private static mapProjectFromDB(
    projectRow: ProjectRow,
    resources: ResourceRow[] = [],
    milestones: PaymentMilestoneRow[] = [],
    issues: IssueRow[] = [],
    weeklyProgress: WeeklyProgressRow[] = [],
    taskRows: TaskRow[] = []
  ): Project {
    return {
      id: projectRow.id,
      name: projectRow.name,
      description: projectRow.description,
      start_date: projectRow.start_date,
      end_date: projectRow.end_date,
      project_value: projectRow.project_value,
      currency: projectRow.currency,
      status: projectRow.status,
      project_status: projectRow.project_status,
      progress: projectRow.progress,
      status_comment: projectRow.status_comment,
      status_changed_at: projectRow.status_changed_at,
      status_changed_by: projectRow.status_changed_by,
      created_at: projectRow.created_at,
      updated_at: projectRow.updated_at,
      resources: resources.map(r => ({
        id: r.id,
        project_id: r.project_id,
        name: r.name,
        role: r.role,
        allocation: r.allocation,
        hourly_rate: r.hourly_rate,
        created_at: r.created_at
      })),
      payment_milestones: milestones.map(m => ({
        id: m.id,
        project_id: m.project_id,
        name: m.name,
        amount: m.amount,
        due_date: m.due_date,
        status: m.status,
        completed_date: m.completed_date,
        created_at: m.created_at
      })),
      issues: issues.map(i => ({
        id: i.id,
        project_id: i.project_id,
        title: i.title,
        description: i.description,
        severity: i.severity,
        status: i.status,
        assigned_to: i.assigned_to,
        category: i.category,
        week_number: i.week_number,
        year: i.year,
        created_at: i.created_at,
        resolved_at: i.resolved_at
      })),
      weekly_progress: weeklyProgress.map(w => ({
        id: w.id,
        project_id: w.project_id,
        week_number: w.week_number,
        year: w.year,
        progress: w.progress,
        issues_resolved: w.issues_resolved,
        issues_created: w.issues_created,
        milestones_completed: w.milestones_completed,
        created_at: w.created_at
      })),
      tasks: taskRows.map(t => ({
        id: t.id,
        project_id: t.project_id,
        name: t.name,
        description: t.description,
        status: t.status,
        priority: t.priority,
        planned_start_date: t.planned_start_date,
        planned_end_date: t.planned_end_date,
        actual_start_date: t.actual_start_date,
        actual_end_date: t.actual_end_date,
        progress: t.progress,
        estimated_hours: t.estimated_hours,
        actual_hours: t.actual_hours,
        created_at: t.created_at,
        updated_at: t.updated_at
      }))
    };
  }

  static async getAllProjects(): Promise<Project[]> {
    try {
      console.log('Fetching all projects from Supabase...');
      
      // Get all projects
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        throw projectsError;
      }

      console.log('Projects fetched:', projects?.length || 0);

      if (!projects || projects.length === 0) {
        console.log('No projects found');
        return [];
      }

      const projectIds = projects.map(p => p.id);
      console.log('Fetching related data for project IDs:', projectIds);

      // Get all related data in parallel  
      const [resourcesResult, milestonesResult, issuesResult, progressResult, tasksResult] = await Promise.all([
        supabase.from('resources').select('*').in('project_id', projectIds),
        supabase.from('payment_milestones').select('*').in('project_id', projectIds),
        supabase.from('issues').select('*').in('project_id', projectIds),
        supabase.from('weekly_progress').select('*').in('project_id', projectIds),
        supabase.from('tasks').select('*').in('project_id', projectIds)
      ]);

      if (resourcesResult.error) {
        console.error('Error fetching resources:', resourcesResult.error);
        throw resourcesResult.error;
      }
      if (milestonesResult.error) {
        console.error('Error fetching milestones:', milestonesResult.error);
        throw milestonesResult.error;
      }
      if (issuesResult.error) {
        console.error('Error fetching issues:', issuesResult.error);
        throw issuesResult.error;
      }
      if (progressResult.error) {
        console.error('Error fetching progress:', progressResult.error);
        throw progressResult.error;
      }
      if (tasksResult.error) {
        console.error('Error fetching tasks:', tasksResult.error);
        throw tasksResult.error;
      }

      console.log('Related data fetched successfully');

      // Group related data by project_id
      const resourcesByProject = (resourcesResult.data || []).reduce((acc, resource) => {
        if (!acc[resource.project_id]) acc[resource.project_id] = [];
        acc[resource.project_id].push(resource);
        return acc;
      }, {} as Record<string, ResourceRow[]>);

      const milestonesByProject = (milestonesResult.data || []).reduce((acc, milestone) => {
        if (!acc[milestone.project_id]) acc[milestone.project_id] = [];
        acc[milestone.project_id].push(milestone);
        return acc;
      }, {} as Record<string, PaymentMilestoneRow[]>);

      const issuesByProject = (issuesResult.data || []).reduce((acc, issue) => {
        if (!acc[issue.project_id]) acc[issue.project_id] = [];
        acc[issue.project_id].push(issue);
        return acc;
      }, {} as Record<string, IssueRow[]>);

      const progressByProject = (progressResult.data || []).reduce((acc, progress) => {
        if (!acc[progress.project_id]) acc[progress.project_id] = [];
        acc[progress.project_id].push(progress);
        return acc;
      }, {} as Record<string, WeeklyProgressRow[]>);

      const tasksByProject = (tasksResult.data || []).reduce((acc, task) => {
        if (!acc[task.project_id]) acc[task.project_id] = [];
        acc[task.project_id].push(task);
        return acc;
      }, {} as Record<string, TaskRow[]>);

      // Map projects with their related data
      return projects.map(project => 
        this.mapProjectFromDB(
          project,
          resourcesByProject[project.id] || [],
          milestonesByProject[project.id] || [],
          issuesByProject[project.id] || [],
          progressByProject[project.id] || [],
          tasksByProject[project.id] || []
        )
      );
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new Error('Failed to fetch projects');
    }
  }

  static async getProjectById(id: string): Promise<Project | null> {
    try {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (projectError) {
        if (projectError.code === 'PGRST116') return null; // Not found
        throw projectError;
      }

      // Get all related data  
      const [resourcesResult, milestonesResult, issuesResult, progressResult, tasksResult] = await Promise.all([
        supabase.from('resources').select('*').eq('project_id', id),
        supabase.from('payment_milestones').select('*').eq('project_id', id),
        supabase.from('issues').select('*').eq('project_id', id),
        supabase.from('weekly_progress').select('*').eq('project_id', id).order('week_number'),
        supabase.from('tasks').select('*').eq('project_id', id).order('created_at')
      ]);

      if (resourcesResult.error) throw resourcesResult.error;
      if (milestonesResult.error) throw milestonesResult.error;
      if (issuesResult.error) throw issuesResult.error;
      if (progressResult.error) throw progressResult.error;
      if (tasksResult.error) throw tasksResult.error;

      return this.mapProjectFromDB(
        project,
        resourcesResult.data || [],
        milestonesResult.data || [],
        issuesResult.data || [],
        progressResult.data || [],
        tasksResult.data || []
      );
    } catch (error) {
      console.error('Error fetching project:', error);
      throw new Error('Failed to fetch project');
    }
  }

  static async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    try {
      console.log('Creating project with data:', project);
      
      // Test connection first
      const { data: testData, error: testError } = await supabase
        .from('projects')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('Supabase connection test failed:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }
      
      console.log('Database connection successful');
      
      // Insert project
      const { data: newProject, error: projectError } = await supabase
        .from('projects')
        .insert({
          name: project.name,
          description: project.description,
          start_date: project.start_date,
          end_date: project.end_date,
          project_value: project.project_value,
          currency: project.currency,
          status: project.status,
          project_status: project.project_status,
          progress: project.progress,
          status_comment: project.status_comment || null,
          status_changed_by: project.status_changed_by || null,
          status_changed_at: project.status_changed_at || null
        })
        .select()
        .single();

      if (projectError) {
        console.error('Error inserting project:', projectError);
        throw new Error(`Failed to insert project: ${projectError.message} (Code: ${projectError.code})`);
      }
      
      console.log('Project created successfully:', newProject);

      const projectId = newProject.id;

      // Insert resources if any
      if (project.resources && project.resources.length > 0) {
        console.log('Inserting resources:', project.resources);
        const { error: resourcesError } = await supabase
          .from('resources')
          .insert(
            project.resources.map(resource => ({
              project_id: projectId,
              name: resource.name,
              role: resource.role,
              allocation: resource.allocation,
              hourly_rate: resource.hourly_rate || null
            }))
          );

        if (resourcesError) {
          console.error('Error inserting resources:', resourcesError);
          throw new Error(`Failed to insert resources: ${resourcesError.message} (Code: ${resourcesError.code})`);
        }
        console.log('Resources inserted successfully');
      }

      // Insert payment milestones if any
      if (project.payment_milestones && project.payment_milestones.length > 0) {
        console.log('Inserting milestones:', project.payment_milestones);
        const { error: milestonesError } = await supabase
          .from('payment_milestones')
          .insert(
            project.payment_milestones.map(milestone => ({
              project_id: projectId,
              name: milestone.name,
              amount: milestone.amount,
              due_date: milestone.due_date,
              status: milestone.status,
              completed_date: milestone.completed_date || null
            }))
          );

        if (milestonesError) {
          console.error('Error inserting milestones:', milestonesError);
          throw new Error(`Failed to insert milestones: ${milestonesError.message} (Code: ${milestonesError.code})`);
        }
        console.log('Milestones inserted successfully');
      }

      // Insert issues if any
      if (project.issues && project.issues.length > 0) {
        console.log('Inserting issues:', project.issues);
        const { error: issuesError } = await supabase
          .from('issues')
          .insert(
            project.issues.map(issue => ({
              project_id: projectId,
              title: issue.title,
              description: issue.description || null,
              severity: issue.severity,
              status: issue.status,
              assigned_to: issue.assigned_to || null,
              category: issue.category,
              week_number: issue.week_number || null,
              year: issue.year || null
            }))
          );

        if (issuesError) {
          console.error('Error inserting issues:', issuesError);
          throw new Error(`Failed to insert issues: ${issuesError.message} (Code: ${issuesError.code})`);
        }
        console.log('Issues inserted successfully');
      }

      // Insert weekly progress if any
      if (project.weekly_progress && project.weekly_progress.length > 0) {
        console.log('Inserting weekly progress:', project.weekly_progress);
        const { error: progressError } = await supabase
          .from('weekly_progress')
          .insert(
            project.weekly_progress.map(progress => ({
              project_id: projectId,
              week_number: progress.week_number,
              year: progress.year,
              progress: progress.progress,
              issues_resolved: progress.issues_resolved,
              issues_created: progress.issues_created,
              milestones_completed: progress.milestones_completed
            }))
          );

        if (progressError) {
          console.error('Error inserting weekly progress:', progressError);
          throw new Error(`Failed to insert weekly progress: ${progressError.message} (Code: ${progressError.code})`);
        }
        console.log('Weekly progress inserted successfully');
      }

      // Return the complete project
      const createdProject = await this.getProjectById(projectId);
      if (!createdProject) throw new Error('Failed to retrieve created project');
      
      console.log('Project creation completed successfully');
      return createdProject;
    } catch (error) {
      console.error('Error creating project:', error);
      if (error instanceof Error) {
        throw error; // Re-throw the original error with its message
      }
      throw new Error('Failed to create project: Unknown error');
    }
  }

  static async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    try {
      console.log('Updating project:', id, updates);
      
      // Update project
      const { error: projectError } = await supabase
        .from('projects')
        .update({
          name: updates.name,
          description: updates.description,
          start_date: updates.start_date,
          end_date: updates.end_date,
          project_value: updates.project_value,
          currency: updates.currency,
          status: updates.status,
          project_status: updates.project_status,
          progress: updates.progress,
          status_comment: updates.status_comment,
          status_changed_by: updates.status_changed_by,
          status_changed_at: updates.status_changed_at
        })
        .eq('id', id);

      if (projectError) {
        console.error('Error updating project:', projectError);
        throw projectError;
      }

      console.log('Project updated successfully');

      // Update resources if provided
      if (updates.resources) {
        console.log('Updating resources...');
        // Delete existing resources
        await supabase.from('resources').delete().eq('project_id', id);
        
        // Insert new resources
        if (updates.resources.length > 0) {
          const { error: resourcesError } = await supabase
            .from('resources')
            .insert(
              updates.resources.map(resource => ({
                project_id: id,
                name: resource.name,
                role: resource.role,
                allocation: resource.allocation,
                hourly_rate: resource.hourly_rate
              }))
            );

          if (resourcesError) {
            console.error('Error updating resources:', resourcesError);
            throw resourcesError;
          }
        }
      }

      // Update payment milestones if provided
      if (updates.payment_milestones) {
        console.log('Updating milestones...');
        // Delete existing milestones
        await supabase.from('payment_milestones').delete().eq('project_id', id);
        
        // Insert new milestones
        if (updates.payment_milestones.length > 0) {
          const { error: milestonesError } = await supabase
            .from('payment_milestones')
            .insert(
              updates.payment_milestones.map(milestone => ({
                project_id: id,
                name: milestone.name,
                amount: milestone.amount,
                due_date: milestone.due_date,
                status: milestone.status,
                completed_date: milestone.completed_date
              }))
            );

          if (milestonesError) {
            console.error('Error updating milestones:', milestonesError);
            throw milestonesError;
          }
        }
      }

      // Return the updated project
      const updatedProject = await this.getProjectById(id);
      if (!updatedProject) throw new Error('Failed to retrieve updated project');
      
      console.log('Project update completed successfully');
      return updatedProject;
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error('Failed to update project');
    }
  }

  static async updateProjectStatus(id: string, statusChange: ProjectStatusChange): Promise<Project> {
    try {
      // Get current project to track old status
      const currentProject = await this.getProjectById(id);
      if (!currentProject) throw new Error('Project not found');

      // Update project status
      const { error: projectError } = await supabase
        .from('projects')
        .update({
          project_status: statusChange.project_status,
          status_comment: statusChange.status_comment,
          status_changed_by: statusChange.status_changed_by,
          status_changed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (projectError) throw projectError;

      // Insert status change record
      const { error: statusChangeError } = await supabase
        .from('project_status_changes')
        .insert({
          project_id: id,
          old_status: currentProject.project_status,
          new_status: statusChange.project_status,
          comment: statusChange.status_comment,
          changed_by: statusChange.status_changed_by
        });

      if (statusChangeError) throw statusChangeError;

      // Return the updated project
      const updatedProject = await this.getProjectById(id);
      if (!updatedProject) throw new Error('Failed to retrieve updated project');
      
      return updatedProject;
    } catch (error) {
      console.error('Error updating project status:', error);
      throw new Error('Failed to update project status');
    }
  }

  static async createIssue(issue: Omit<Issue, 'id' | 'created_at'>): Promise<Issue> {
    try {
      console.log('Creating issue:', issue);
      const currentDate = new Date();
      const weekNumber = this.getWeekNumber(currentDate);
      const year = currentDate.getFullYear();

      const { data: newIssue, error } = await supabase
        .from('issues')
        .insert({
          project_id: issue.project_id,
          title: issue.title,
          description: issue.description,
          severity: issue.severity,
          status: issue.status || 'open',
          assigned_to: issue.assigned_to,
          category: issue.category,
          week_number: weekNumber,
          year: year
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating issue:', error);
        throw error;
      }

      console.log('Issue created successfully:', newIssue);

      return {
        id: newIssue.id,
        project_id: newIssue.project_id,
        title: newIssue.title,
        description: newIssue.description,
        severity: newIssue.severity,
        status: newIssue.status,
        assigned_to: newIssue.assigned_to,
        category: newIssue.category,
        week_number: newIssue.week_number,
        year: newIssue.year,
        created_at: newIssue.created_at,
        resolved_at: newIssue.resolved_at
      };
    } catch (error) {
      console.error('Error creating issue:', error);
      throw new Error('Failed to create issue');
    }
  }

  static async updateIssue(id: string, updates: Partial<Issue>): Promise<Issue> {
    try {
      const { data: updatedIssue, error } = await supabase
        .from('issues')
        .update({
          title: updates.title,
          description: updates.description,
          severity: updates.severity,
          status: updates.status,
          assigned_to: updates.assigned_to,
          category: updates.category
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: updatedIssue.id,
        project_id: updatedIssue.project_id,
        title: updatedIssue.title,
        description: updatedIssue.description,
        severity: updatedIssue.severity,
        status: updatedIssue.status,
        assigned_to: updatedIssue.assigned_to,
        category: updatedIssue.category,
        week_number: updatedIssue.week_number,
        year: updatedIssue.year,
        created_at: updatedIssue.created_at,
        resolved_at: updatedIssue.resolved_at
      };
    } catch (error) {
      console.error('Error updating issue:', error);
      throw new Error('Failed to update issue');
    }
  }

  static async bulkCreateIssues(issues: Omit<Issue, 'id' | 'created_at'>[]): Promise<Issue[]> {
    try {
      const currentDate = new Date();
      const weekNumber = this.getWeekNumber(currentDate);
      const year = currentDate.getFullYear();

      const { data: newIssues, error } = await supabase
        .from('issues')
        .insert(
          issues.map(issue => ({
            project_id: issue.project_id,
            title: issue.title,
            description: issue.description,
            severity: issue.severity,
            status: issue.status || 'open',
            assigned_to: issue.assigned_to,
            category: issue.category,
            week_number: weekNumber,
            year: year
          }))
        )
        .select();

      if (error) throw error;

      return (newIssues || []).map(issue => ({
        id: issue.id,
        project_id: issue.project_id,
        title: issue.title,
        description: issue.description,
        severity: issue.severity,
        status: issue.status,
        assigned_to: issue.assigned_to,
        category: issue.category,
        week_number: issue.week_number,
        year: issue.year,
        created_at: issue.created_at,
        resolved_at: issue.resolved_at
      }));
    } catch (error) {
      console.error('Error bulk creating issues:', error);
      throw new Error('Failed to bulk create issues');
    }
  }

  static async createWeeklyProgress(progress: Omit<WeeklyProgress, 'id' | 'created_at'>): Promise<WeeklyProgress> {
    try {
      const { data: newProgress, error } = await supabase
        .from('weekly_progress')
        .upsert({
          project_id: progress.project_id,
          week_number: progress.week_number,
          year: progress.year,
          progress: progress.progress,
          issues_resolved: progress.issues_resolved,
          issues_created: progress.issues_created,
          milestones_completed: progress.milestones_completed
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: newProgress.id,
        project_id: newProgress.project_id,
        week_number: newProgress.week_number,
        year: newProgress.year,
        progress: newProgress.progress,
        issues_resolved: newProgress.issues_resolved,
        issues_created: newProgress.issues_created,
        milestones_completed: newProgress.milestones_completed,
        created_at: newProgress.created_at
      };
    } catch (error) {
      console.error('Error creating weekly progress:', error);
      throw new Error('Failed to create weekly progress');
    }
  }

  static async deleteProject(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw new Error('Failed to delete project');
    }
  }

  static getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
}