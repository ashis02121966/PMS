export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          description: string
          start_date: string
          end_date: string
          project_value: number
          currency: string
          status: 'red' | 'amber' | 'green'
          project_status: 'active' | 'inactive' | 'hold' | 'completed'
          progress: number
          status_comment: string | null
          status_changed_at: string | null
          status_changed_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          start_date: string
          end_date: string
          project_value?: number
          currency?: string
          status?: 'red' | 'amber' | 'green'
          project_status?: 'active' | 'inactive' | 'hold' | 'completed'
          progress?: number
          status_comment?: string | null
          status_changed_at?: string | null
          status_changed_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          start_date?: string
          end_date?: string
          project_value?: number
          currency?: string
          status?: 'red' | 'amber' | 'green'
          project_status?: 'active' | 'inactive' | 'hold' | 'completed'
          progress?: number
          status_comment?: string | null
          status_changed_at?: string | null
          status_changed_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          project_id: string
          name: string
          role: string
          allocation: number
          hourly_rate: number | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          role: string
          allocation?: number
          hourly_rate?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          role?: string
          allocation?: number
          hourly_rate?: number | null
          created_at?: string
        }
      }
      payment_milestones: {
        Row: {
          id: string
          project_id: string
          name: string
          amount: number
          due_date: string
          status: 'pending' | 'completed' | 'overdue'
          completed_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          amount?: number
          due_date: string
          status?: 'pending' | 'completed' | 'overdue'
          completed_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          amount?: number
          due_date?: string
          status?: 'pending' | 'completed' | 'overdue'
          completed_date?: string | null
          created_at?: string
        }
      }
      issues: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          severity: 'low' | 'medium' | 'high' | 'critical'
          status: 'open' | 'in-progress' | 'resolved' | 'closed'
          assigned_to: string | null
          category: 'bug' | 'feature' | 'improvement' | 'other'
          week_number: number | null
          year: number | null
          created_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          severity?: 'low' | 'medium' | 'high' | 'critical'
          status?: 'open' | 'in-progress' | 'resolved' | 'closed'
          assigned_to?: string | null
          category?: 'bug' | 'feature' | 'improvement' | 'other'
          week_number?: number | null
          year?: number | null
          created_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          severity?: 'low' | 'medium' | 'high' | 'critical'
          status?: 'open' | 'in-progress' | 'resolved' | 'closed'
          assigned_to?: string | null
          category?: 'bug' | 'feature' | 'improvement' | 'other'
          week_number?: number | null
          year?: number | null
          created_at?: string
          resolved_at?: string | null
        }
      }
      weekly_progress: {
        Row: {
          id: string
          project_id: string
          week_number: number
          year: number
          progress: number
          issues_resolved: number
          issues_created: number
          milestones_completed: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          week_number: number
          year: number
          progress?: number
          issues_resolved?: number
          issues_created?: number
          milestones_completed?: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          week_number?: number
          year?: number
          progress?: number
          issues_resolved?: number
          issues_created?: number
          milestones_completed?: number
          created_at?: string
        }
      }
      project_status_changes: {
        Row: {
          id: string
          project_id: string
          old_status: string | null
          new_status: string
          comment: string
          changed_by: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          old_status?: string | null
          new_status: string
          comment: string
          changed_by: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          old_status?: string | null
          new_status?: string
          comment?: string
          changed_by?: string
          created_at?: string
        }
      }
    }
    tasks: {
      Row: {
        id: string
        project_id: string
        name: string
        description: string | null
        status: 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled'
        priority: 'low' | 'medium' | 'high' | 'critical'
        planned_start_date: string | null
        planned_end_date: string | null
        actual_start_date: string | null
        actual_end_date: string | null
        progress: number
        estimated_hours: number
        actual_hours: number
        created_at: string
        updated_at: string
      }
      Insert: {
        id?: string
        project_id: string
        name: string
        description?: string | null
        status?: 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled'
        priority?: 'low' | 'medium' | 'high' | 'critical'
        planned_start_date?: string | null
        planned_end_date?: string | null
        actual_start_date?: string | null
        actual_end_date?: string | null
        progress?: number
        estimated_hours?: number
        actual_hours?: number
        created_at?: string
        updated_at?: string
      }
      Update: {
        id?: string
        project_id?: string
        name?: string
        description?: string | null
        status?: 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled'
        priority?: 'low' | 'medium' | 'high' | 'critical'
        planned_start_date?: string | null
        planned_end_date?: string | null
        actual_start_date?: string | null
        actual_end_date?: string | null
        progress?: number
        estimated_hours?: number
        actual_hours?: number
        created_at?: string
        updated_at?: string
      }
    }
    task_dependencies: {
      Row: {
        id: string
        predecessor_task_id: string
        successor_task_id: string
        dependency_type: 'start_to_start' | 'start_to_finish' | 'finish_to_start' | 'finish_to_finish'
        lag_days: number
        created_at: string
      }
      Insert: {
        id?: string
        predecessor_task_id: string
        successor_task_id: string
        dependency_type?: 'start_to_start' | 'start_to_finish' | 'finish_to_start' | 'finish_to_finish'
        lag_days?: number
        created_at?: string
      }
      Update: {
        id?: string
        predecessor_task_id?: string
        successor_task_id?: string
        dependency_type?: 'start_to_start' | 'start_to_finish' | 'finish_to_start' | 'finish_to_finish'
        lag_days?: number
        created_at?: string
      }
    }
    task_resources: {
      Row: {
        id: string
        task_id: string
        resource_name: string
        role: string
        allocation_percentage: number
        planned_start_date: string | null
        planned_end_date: string | null
        actual_start_date: string | null
        actual_end_date: string | null
        hourly_rate: number
        created_at: string
      }
      Insert: {
        id?: string
        task_id: string
        resource_name: string
        role: string
        allocation_percentage?: number
        planned_start_date?: string | null
        planned_end_date?: string | null
        actual_start_date?: string | null
        actual_end_date?: string | null
        hourly_rate?: number
        created_at?: string
      }
      Update: {
        id?: string
        task_id?: string
        resource_name?: string
        role?: string
        allocation_percentage?: number
        planned_start_date?: string | null
        planned_end_date?: string | null
        actual_start_date?: string | null
        actual_end_date?: string | null
        hourly_rate?: number
        created_at?: string
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}