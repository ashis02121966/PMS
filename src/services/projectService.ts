import { SupabaseProjectService } from './supabaseProjectService';
import { Project, Issue, WeeklyProgress, ProjectStatusChange } from '../types/project';

export class ProjectService {
  static async getAllProjects(): Promise<Project[]> {
    return SupabaseProjectService.getAllProjects();
  }

  static async getProjectById(id: string): Promise<Project | null> {
    return SupabaseProjectService.getProjectById(id);
  }

  static async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    return SupabaseProjectService.createProject(project);
  }

  static async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    return SupabaseProjectService.updateProject(id, updates);
  }

  static async updateProjectStatus(id: string, statusChange: ProjectStatusChange): Promise<Project> {
    return SupabaseProjectService.updateProjectStatus(id, statusChange);
  }

  static async createIssue(issue: Omit<Issue, 'id' | 'created_at'>): Promise<Issue> {
    return SupabaseProjectService.createIssue(issue);
  }

  static async updateIssue(id: string, updates: Partial<Issue>): Promise<Issue> {
    return SupabaseProjectService.updateIssue(id, updates);
  }

  static async bulkCreateIssues(issues: Omit<Issue, 'id' | 'created_at'>[]): Promise<Issue[]> {
    return SupabaseProjectService.bulkCreateIssues(issues);
  }

  static async createWeeklyProgress(progress: Omit<WeeklyProgress, 'id' | 'created_at'>): Promise<WeeklyProgress> {
    return SupabaseProjectService.createWeeklyProgress(progress);
  }

  static async getWeeklyProgressByProject(projectId: string): Promise<WeeklyProgress[]> {
    const project = await SupabaseProjectService.getProjectById(projectId);
    return project?.weekly_progress || [];
  }

  static async getIssuesByWeek(projectId: string, weekNumber: number, year: number): Promise<Issue[]> {
    const project = await SupabaseProjectService.getProjectById(projectId);
    if (!project?.issues) return [];

    return project.issues.filter(
      issue => issue.week_number === weekNumber && issue.year === year
    );
  }

  static getWeekNumber(date: Date): number {
    return SupabaseProjectService.getWeekNumber(date);
  }

  static async deleteProject(id: string): Promise<void> {
    return SupabaseProjectService.deleteProject(id);
  }

  // Excel export methods
  static exportAllProjectsToCSV(): void {
    // TODO: Implement CSV export from Supabase data
    console.log('CSV export not yet implemented for Supabase');
  }

  static exportProjectResources(projectId: string): void {
    // TODO: Implement CSV export from Supabase data
    console.log('CSV export not yet implemented for Supabase');
  }

  static exportProjectMilestones(projectId: string): void {
    // TODO: Implement CSV export from Supabase data
    console.log('CSV export not yet implemented for Supabase');
  }

  static exportProjectIssues(projectId: string): void {
    // TODO: Implement CSV export from Supabase data
    console.log('CSV export not yet implemented for Supabase');
  }
}