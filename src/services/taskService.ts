import { supabase } from '../lib/supabase';
import { Task, TaskDependency, TaskResource, TaskDeviation, GanttTask } from '../types/task';
import { Database } from '../types/database';

type TaskRow = Database['public']['Tables']['tasks']['Row'];
type TaskDependencyRow = Database['public']['Tables']['task_dependencies']['Row'];
type TaskResourceRow = Database['public']['Tables']['task_resources']['Row'];

export class TaskService {
  // Helper function to convert database row to Task type
  private static mapTaskFromDB(
    taskRow: TaskRow,
    dependencies: TaskDependencyRow[] = [],
    resources: TaskResourceRow[] = []
  ): Task {
    return {
      id: taskRow.id,
      project_id: taskRow.project_id,
      name: taskRow.name,
      description: taskRow.description,
      status: taskRow.status,
      priority: taskRow.priority,
      planned_start_date: taskRow.planned_start_date,
      planned_end_date: taskRow.planned_end_date,
      actual_start_date: taskRow.actual_start_date,
      actual_end_date: taskRow.actual_end_date,
      progress: taskRow.progress,
      estimated_hours: taskRow.estimated_hours,
      actual_hours: taskRow.actual_hours,
      created_at: taskRow.created_at,
      updated_at: taskRow.updated_at,
      dependencies: dependencies.map(d => ({
        id: d.id,
        predecessor_task_id: d.predecessor_task_id,
        successor_task_id: d.successor_task_id,
        dependency_type: d.dependency_type,
        lag_days: d.lag_days,
        created_at: d.created_at
      })),
      resources: resources.map(r => ({
        id: r.id,
        task_id: r.task_id,
        resource_name: r.resource_name,
        role: r.role,
        allocation_percentage: r.allocation_percentage,
        planned_start_date: r.planned_start_date,
        planned_end_date: r.planned_end_date,
        actual_start_date: r.actual_start_date,
        actual_end_date: r.actual_end_date,
        hourly_rate: r.hourly_rate,
        created_at: r.created_at
      }))
    };
  }

  static async getTasksByProject(projectId: string): Promise<Task[]> {
    try {
      // Get all tasks for the project
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (tasksError) throw tasksError;

      if (!tasks || tasks.length === 0) {
        return [];
      }

      const taskIds = tasks.map(t => t.id);

      // Get all related data in parallel
      const [dependenciesResult, resourcesResult] = await Promise.all([
        supabase.from('task_dependencies').select('*').in('predecessor_task_id', taskIds),
        supabase.from('task_resources').select('*').in('task_id', taskIds)
      ]);

      if (dependenciesResult.error) throw dependenciesResult.error;
      if (resourcesResult.error) throw resourcesResult.error;

      // Group related data by task_id
      const dependenciesByTask = (dependenciesResult.data || []).reduce((acc, dep) => {
        if (!acc[dep.predecessor_task_id]) acc[dep.predecessor_task_id] = [];
        acc[dep.predecessor_task_id].push(dep);
        return acc;
      }, {} as Record<string, TaskDependencyRow[]>);

      const resourcesByTask = (resourcesResult.data || []).reduce((acc, resource) => {
        if (!acc[resource.task_id]) acc[resource.task_id] = [];
        acc[resource.task_id].push(resource);
        return acc;
      }, {} as Record<string, TaskResourceRow[]>);

      // Map tasks with their related data
      return tasks.map(task => 
        this.mapTaskFromDB(
          task,
          dependenciesByTask[task.id] || [],
          resourcesByTask[task.id] || []
        )
      );
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  }

  static async getTaskById(id: string): Promise<Task | null> {
    try {
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();

      if (taskError) {
        if (taskError.code === 'PGRST116') return null; // Not found
        throw taskError;
      }

      // Get related data
      const [dependenciesResult, resourcesResult] = await Promise.all([
        supabase.from('task_dependencies').select('*').eq('predecessor_task_id', id),
        supabase.from('task_resources').select('*').eq('task_id', id)
      ]);

      if (dependenciesResult.error) throw dependenciesResult.error;
      if (resourcesResult.error) throw resourcesResult.error;

      return this.mapTaskFromDB(
        task,
        dependenciesResult.data || [],
        resourcesResult.data || []
      );
    } catch (error) {
      console.error('Error fetching task:', error);
      throw new Error('Failed to fetch task');
    }
  }

  static async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    try {
      console.log('Creating task with data:', task);
      
      // Insert task
      const { data: newTask, error: taskError } = await supabase
        .from('tasks')
        .insert({
          project_id: task.project_id,
          name: task.name,
          description: task.description || null,
          status: task.status,
          priority: task.priority,
          planned_start_date: task.planned_start_date || null,
          planned_end_date: task.planned_end_date || null,
          actual_start_date: task.actual_start_date || null,
          actual_end_date: task.actual_end_date || null,
          progress: task.progress,
          estimated_hours: task.estimated_hours,
          actual_hours: task.actual_hours
        })
        .select()
        .single();

      if (taskError) throw taskError;
      
      console.log('Task created successfully:', newTask);

      const taskId = newTask.id;

      // Insert dependencies if any
      if (task.dependencies && task.dependencies.length > 0) {
        console.log('Inserting dependencies:', task.dependencies);
        const { error: dependenciesError } = await supabase
          .from('task_dependencies')
          .insert(
            task.dependencies.map(dep => ({
              predecessor_task_id: dep.predecessor_task_id,
              successor_task_id: taskId,
              dependency_type: dep.dependency_type,
              lag_days: dep.lag_days
            }))
          );

        if (dependenciesError) {
          console.error('Error inserting dependencies:', dependenciesError);
          throw dependenciesError;
        }
      }

      // Insert resources if any
      if (task.resources && task.resources.length > 0) {
        console.log('Inserting task resources:', task.resources);
        const { error: resourcesError } = await supabase
          .from('task_resources')
          .insert(
            task.resources.map(resource => ({
              task_id: taskId,
              resource_name: resource.resource_name,
              role: resource.role,
              allocation_percentage: resource.allocation_percentage,
              planned_start_date: resource.planned_start_date || null,
              planned_end_date: resource.planned_end_date || null,
              actual_start_date: resource.actual_start_date || null,
              actual_end_date: resource.actual_end_date || null,
              hourly_rate: resource.hourly_rate
            }))
          );

        if (resourcesError) {
          console.error('Error inserting task resources:', resourcesError);
          throw resourcesError;
        }
      }

      // Return the complete task
      const createdTask = await this.getTaskById(taskId);
      if (!createdTask) throw new Error('Failed to retrieve created task');
      
      console.log('Task creation completed successfully');
      return createdTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error(`Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    try {
      console.log('Updating task:', id, updates);
      
      // Update task
      const { error: taskError } = await supabase
        .from('tasks')
        .update({
          name: updates.name,
          description: updates.description,
          status: updates.status,
          priority: updates.priority,
          planned_start_date: updates.planned_start_date,
          planned_end_date: updates.planned_end_date,
          actual_start_date: updates.actual_start_date,
          actual_end_date: updates.actual_end_date,
          progress: updates.progress,
          estimated_hours: updates.estimated_hours,
          actual_hours: updates.actual_hours
        })
        .eq('id', id);

      if (taskError) throw taskError;

      // Update dependencies if provided
      if (updates.dependencies) {
        // Delete existing dependencies
        await supabase.from('task_dependencies').delete().eq('successor_task_id', id);
        
        // Insert new dependencies
        if (updates.dependencies.length > 0) {
          const { error: dependenciesError } = await supabase
            .from('task_dependencies')
            .insert(
              updates.dependencies.map(dep => ({
                predecessor_task_id: dep.predecessor_task_id,
                successor_task_id: id,
                dependency_type: dep.dependency_type,
                lag_days: dep.lag_days
              }))
            );

          if (dependenciesError) throw dependenciesError;
        }
      }

      // Update resources if provided
      if (updates.resources) {
        // Delete existing resources
        await supabase.from('task_resources').delete().eq('task_id', id);
        
        // Insert new resources
        if (updates.resources.length > 0) {
          const { error: resourcesError } = await supabase
            .from('task_resources')
            .insert(
              updates.resources.map(resource => ({
                task_id: id,
                resource_name: resource.resource_name,
                role: resource.role,
                allocation_percentage: resource.allocation_percentage,
                planned_start_date: resource.planned_start_date,
                planned_end_date: resource.planned_end_date,
                actual_start_date: resource.actual_start_date,
                actual_end_date: resource.actual_end_date,
                hourly_rate: resource.hourly_rate
              }))
            );

          if (resourcesError) throw resourcesError;
        }
      }

      // Return the updated task
      const updatedTask = await this.getTaskById(id);
      if (!updatedTask) throw new Error('Failed to retrieve updated task');
      
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    }
  }

  static async deleteTask(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }
  }

  static async createTaskDependency(dependency: Omit<TaskDependency, 'id' | 'created_at'>): Promise<TaskDependency> {
    try {
      const { data: newDependency, error } = await supabase
        .from('task_dependencies')
        .insert({
          predecessor_task_id: dependency.predecessor_task_id,
          successor_task_id: dependency.successor_task_id,
          dependency_type: dependency.dependency_type,
          lag_days: dependency.lag_days
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: newDependency.id,
        predecessor_task_id: newDependency.predecessor_task_id,
        successor_task_id: newDependency.successor_task_id,
        dependency_type: newDependency.dependency_type,
        lag_days: newDependency.lag_days,
        created_at: newDependency.created_at
      };
    } catch (error) {
      console.error('Error creating task dependency:', error);
      throw new Error('Failed to create task dependency');
    }
  }

  static async deleteTaskDependency(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('task_dependencies')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting task dependency:', error);
      throw new Error('Failed to delete task dependency');
    }
  }

  static async getTaskDeviation(taskId: string): Promise<TaskDeviation> {
    try {
      const { data, error } = await supabase
        .rpc('calculate_task_deviation', { task_id: taskId });

      if (error) throw error;

      if (data && data.length > 0) {
        return {
          start_deviation: data[0].start_deviation,
          end_deviation: data[0].end_deviation,
          duration_deviation: data[0].duration_deviation
        };
      }

      return {
        start_deviation: 0,
        end_deviation: 0,
        duration_deviation: 0
      };
    } catch (error) {
      console.error('Error calculating task deviation:', error);
      return {
        start_deviation: 0,
        end_deviation: 0,
        duration_deviation: 0
      };
    }
  }

  static async generateGanttData(projectId: string): Promise<GanttTask[]> {
    try {
      const tasks = await this.getTasksByProject(projectId);
      
      return tasks.map(task => ({
        id: task.id,
        name: task.name,
        start: new Date(task.planned_start_date || task.created_at),
        end: new Date(task.planned_end_date || task.created_at),
        progress: task.progress,
        dependencies: task.dependencies?.map(d => d.predecessor_task_id) || [],
        type: 'task' as const,
        status: task.status,
        priority: task.priority
      }));
    } catch (error) {
      console.error('Error generating Gantt data:', error);
      throw new Error('Failed to generate Gantt data');
    }
  }
}