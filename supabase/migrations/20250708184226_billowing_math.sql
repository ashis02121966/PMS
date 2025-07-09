/*
  # Add Task Management System

  1. New Tables
    - `tasks` - Project tasks with scheduling and status tracking
    - `task_dependencies` - Task dependencies with different types
    - `task_resources` - Resource allocation to tasks with dates and deviation tracking

  2. Features
    - CRUD operations for tasks
    - Three dependency types: start-to-start, start-to-end, end-to-end
    - Resource allocation with planned vs actual dates
    - Deviation calculation and tracking
    - Support for Gantt chart generation

  3. Security
    - Enable RLS on all new tables
    - Add policies for public access (demo purposes)
*/

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    status text DEFAULT 'not_started' NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed', 'on_hold', 'cancelled')),
    priority text DEFAULT 'medium' NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    planned_start_date date,
    planned_end_date date,
    actual_start_date date,
    actual_end_date date,
    progress integer DEFAULT 0 NOT NULL CHECK (progress >= 0 AND progress <= 100),
    estimated_hours numeric(10,2) DEFAULT 0,
    actual_hours numeric(10,2) DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Task dependencies table
CREATE TABLE IF NOT EXISTS task_dependencies (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    predecessor_task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    successor_task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    dependency_type text DEFAULT 'finish_to_start' NOT NULL CHECK (dependency_type IN ('start_to_start', 'start_to_finish', 'finish_to_start', 'finish_to_finish')),
    lag_days integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    UNIQUE(predecessor_task_id, successor_task_id)
);

-- Task resources table
CREATE TABLE IF NOT EXISTS task_resources (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    resource_name text NOT NULL,
    role text NOT NULL,
    allocation_percentage integer DEFAULT 100 NOT NULL CHECK (allocation_percentage >= 0 AND allocation_percentage <= 100),
    planned_start_date date,
    planned_end_date date,
    actual_start_date date,
    actual_end_date date,
    hourly_rate numeric(10,2) DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_planned_dates ON tasks(planned_start_date, planned_end_date);
CREATE INDEX IF NOT EXISTS idx_task_dependencies_predecessor ON task_dependencies(predecessor_task_id);
CREATE INDEX IF NOT EXISTS idx_task_dependencies_successor ON task_dependencies(successor_task_id);
CREATE INDEX IF NOT EXISTS idx_task_resources_task_id ON task_resources(task_id);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_resources ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (demo purposes)
CREATE POLICY "Allow public access to tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to task_dependencies" ON task_dependencies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to task_resources" ON task_resources FOR ALL USING (true) WITH CHECK (true);

-- Create trigger for tasks updated_at
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate task deviation
CREATE OR REPLACE FUNCTION calculate_task_deviation(task_id uuid)
RETURNS TABLE (
    start_deviation integer,
    end_deviation integer,
    duration_deviation integer
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE 
            WHEN t.actual_start_date IS NOT NULL AND t.planned_start_date IS NOT NULL 
            THEN t.actual_start_date - t.planned_start_date
            ELSE 0
        END as start_deviation,
        CASE 
            WHEN t.actual_end_date IS NOT NULL AND t.planned_end_date IS NOT NULL 
            THEN t.actual_end_date - t.planned_end_date
            ELSE 0
        END as end_deviation,
        CASE 
            WHEN t.actual_start_date IS NOT NULL AND t.actual_end_date IS NOT NULL 
                 AND t.planned_start_date IS NOT NULL AND t.planned_end_date IS NOT NULL
            THEN (t.actual_end_date - t.actual_start_date) - (t.planned_end_date - t.planned_start_date)
            ELSE 0
        END as duration_deviation
    FROM tasks t
    WHERE t.id = task_id;
END;
$$ LANGUAGE plpgsql;