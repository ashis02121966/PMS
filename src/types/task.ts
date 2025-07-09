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