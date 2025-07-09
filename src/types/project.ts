export interface Project {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  project_value: number;
  currency: string;
  status: 'red' | 'amber' | 'green';
  project_status: 'active' | 'inactive' | 'hold' | 'completed';
  progress: number;
  status_comment?: string;
  status_changed_at?: string;
  status_changed_by?: string;
  created_at: string;
  updated_at: string;
  resources?: Resource[];
  payment_milestones?: PaymentMilestone[];
  issues?: Issue[];
  weekly_progress?: WeeklyProgress[];
  tasks?: Task[];
}

export interface Task {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  planned_start_date?: string;
  planned_end_date?: string;
  actual_start_date?: string;
  actual_end_date?: string;
  progress: number;
  estimated_hours: number;
  actual_hours: number;
  created_at: string;
  updated_at: string;
  dependencies?: TaskDependency[];
  resources?: TaskResource[];
}

export interface TaskDependency {
  id: string;
  predecessor_task_id: string;
  successor_task_id: string;
  dependency_type: 'start_to_start' | 'start_to_finish' | 'finish_to_start' | 'finish_to_finish';
  lag_days: number;
  created_at: string;
  predecessor_task?: Task;
  successor_task?: Task;
}

export interface TaskResource {
  id: string;
  task_id: string;
  resource_name: string;
  role: string;
  allocation_percentage: number;
  planned_start_date?: string;
  planned_end_date?: string;
  actual_start_date?: string;
  actual_end_date?: string;
  hourly_rate: number;
  created_at: string;
}

export interface TaskDeviation {
  start_deviation: number;
  end_deviation: number;
  duration_deviation: number;
}

export interface GanttTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  dependencies: string[];
  type: 'task' | 'milestone';
  status: string;
  priority: string;
}

export interface Resource {
  id: string;
  project_id: string;
  name: string;
  role: string;
  allocation: number;
  hourly_rate?: number;
  created_at: string;
}

export interface PaymentMilestone {
  id: string;
  project_id: string;
  name: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'completed' | 'overdue';
  completed_date?: string;
  created_at: string;
}

export interface Issue {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assigned_to?: string;
  category: 'bug' | 'feature' | 'improvement' | 'other';
  week_number?: number;
  year?: number;
  created_at: string;
  resolved_at?: string;
}

export interface WeeklyProgress {
  id: string;
  project_id: string;
  week_number: number;
  year: number;
  progress: number;
  issues_resolved: number;
  issues_created: number;
  milestones_completed: number;
  created_at: string;
}

export interface ProjectStatusChange {
  project_status: 'active' | 'inactive' | 'hold' | 'completed';
  status_comment: string;
  status_changed_by: string;
}