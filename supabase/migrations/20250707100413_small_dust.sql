/*
  # Complete Project Management Database Schema

  This migration creates the complete database schema for the project management application.

  ## New Tables
  1. `projects` - Main project information with status tracking
  2. `resources` - Project team members and their allocations
  3. `payment_milestones` - Project payment schedules and tracking
  4. `issues` - Project issues and bug tracking
  5. `weekly_progress` - Weekly progress tracking for projects
  6. `project_status_changes` - Audit trail for project status changes

  ## Functions
  - `update_updated_at_column()` - Automatically updates updated_at timestamps
  - `update_issue_resolved_at()` - Automatically sets resolved_at when issue status changes

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to perform CRUD operations
  - Add appropriate indexes for performance
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to update issue resolved_at when status changes to resolved/closed
CREATE OR REPLACE FUNCTION update_issue_resolved_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status IN ('resolved', 'closed') AND OLD.status NOT IN ('resolved', 'closed') THEN
        NEW.resolved_at = now();
    ELSIF NEW.status NOT IN ('resolved', 'closed') AND OLD.status IN ('resolved', 'closed') THEN
        NEW.resolved_at = NULL;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    project_value bigint DEFAULT 0 NOT NULL,
    currency text DEFAULT 'INR' NOT NULL,
    status text DEFAULT 'green' NOT NULL CHECK (status = ANY (ARRAY['red', 'amber', 'green'])),
    project_status text DEFAULT 'active' NOT NULL CHECK (project_status = ANY (ARRAY['active', 'inactive', 'hold', 'completed'])),
    progress integer DEFAULT 0 NOT NULL CHECK (progress >= 0 AND progress <= 100),
    status_comment text,
    status_changed_at timestamptz,
    status_changed_by text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name text NOT NULL,
    role text NOT NULL,
    allocation integer DEFAULT 100 NOT NULL CHECK (allocation >= 0 AND allocation <= 100),
    hourly_rate numeric(10,2) DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Create payment_milestones table
CREATE TABLE IF NOT EXISTS payment_milestones (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name text NOT NULL,
    amount bigint DEFAULT 0 NOT NULL,
    due_date date NOT NULL,
    status text DEFAULT 'pending' NOT NULL CHECK (status = ANY (ARRAY['pending', 'completed', 'overdue'])),
    completed_date date,
    created_at timestamptz DEFAULT now()
);

-- Create issues table
CREATE TABLE IF NOT EXISTS issues (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    severity text DEFAULT 'medium' NOT NULL CHECK (severity = ANY (ARRAY['low', 'medium', 'high', 'critical'])),
    status text DEFAULT 'open' NOT NULL CHECK (status = ANY (ARRAY['open', 'in-progress', 'resolved', 'closed'])),
    assigned_to text,
    category text DEFAULT 'bug' NOT NULL CHECK (category = ANY (ARRAY['bug', 'feature', 'improvement', 'other'])),
    week_number integer,
    year integer,
    created_at timestamptz DEFAULT now(),
    resolved_at timestamptz
);

-- Create weekly_progress table
CREATE TABLE IF NOT EXISTS weekly_progress (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    week_number integer NOT NULL CHECK (week_number >= 1 AND week_number <= 53),
    year integer NOT NULL,
    progress integer DEFAULT 0 NOT NULL CHECK (progress >= 0 AND progress <= 100),
    issues_resolved integer DEFAULT 0 NOT NULL,
    issues_created integer DEFAULT 0 NOT NULL,
    milestones_completed integer DEFAULT 0 NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE(project_id, week_number, year)
);

-- Create project_status_changes table
CREATE TABLE IF NOT EXISTS project_status_changes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    old_status text,
    new_status text NOT NULL,
    comment text NOT NULL,
    changed_by text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_project_status ON projects(project_status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

CREATE INDEX IF NOT EXISTS idx_resources_project_id ON resources(project_id);

CREATE INDEX IF NOT EXISTS idx_payment_milestones_project_id ON payment_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_payment_milestones_status ON payment_milestones(status);

CREATE INDEX IF NOT EXISTS idx_issues_project_id ON issues(project_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_severity ON issues(severity);

CREATE INDEX IF NOT EXISTS idx_weekly_progress_project_id ON weekly_progress(project_id);
CREATE INDEX IF NOT EXISTS idx_weekly_progress_week_year ON weekly_progress(week_number, year);

-- Create triggers
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_issues_resolved_at ON issues;
CREATE TRIGGER update_issues_resolved_at
    BEFORE UPDATE ON issues
    FOR EACH ROW
    EXECUTE FUNCTION update_issue_resolved_at();

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_status_changes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for projects
DROP POLICY IF EXISTS "Users can view all projects" ON projects;
CREATE POLICY "Users can view all projects"
    ON projects FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Users can insert projects" ON projects;
CREATE POLICY "Users can insert projects"
    ON projects FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update projects" ON projects;
CREATE POLICY "Users can update projects"
    ON projects FOR UPDATE
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Users can delete projects" ON projects;
CREATE POLICY "Users can delete projects"
    ON projects FOR DELETE
    TO authenticated
    USING (true);

-- Create RLS policies for resources
DROP POLICY IF EXISTS "Users can view all resources" ON resources;
CREATE POLICY "Users can view all resources"
    ON resources FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Users can insert resources" ON resources;
CREATE POLICY "Users can insert resources"
    ON resources FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update resources" ON resources;
CREATE POLICY "Users can update resources"
    ON resources FOR UPDATE
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Users can delete resources" ON resources;
CREATE POLICY "Users can delete resources"
    ON resources FOR DELETE
    TO authenticated
    USING (true);

-- Create RLS policies for payment_milestones
DROP POLICY IF EXISTS "Users can view all payment_milestones" ON payment_milestones;
CREATE POLICY "Users can view all payment_milestones"
    ON payment_milestones FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Users can insert payment_milestones" ON payment_milestones;
CREATE POLICY "Users can insert payment_milestones"
    ON payment_milestones FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update payment_milestones" ON payment_milestones;
CREATE POLICY "Users can update payment_milestones"
    ON payment_milestones FOR UPDATE
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Users can delete payment_milestones" ON payment_milestones;
CREATE POLICY "Users can delete payment_milestones"
    ON payment_milestones FOR DELETE
    TO authenticated
    USING (true);

-- Create RLS policies for issues
DROP POLICY IF EXISTS "Users can view all issues" ON issues;
CREATE POLICY "Users can view all issues"
    ON issues FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Users can insert issues" ON issues;
CREATE POLICY "Users can insert issues"
    ON issues FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update issues" ON issues;
CREATE POLICY "Users can update issues"
    ON issues FOR UPDATE
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Users can delete issues" ON issues;
CREATE POLICY "Users can delete issues"
    ON issues FOR DELETE
    TO authenticated
    USING (true);

-- Create RLS policies for weekly_progress
DROP POLICY IF EXISTS "Users can view all weekly_progress" ON weekly_progress;
CREATE POLICY "Users can view all weekly_progress"
    ON weekly_progress FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Users can insert weekly_progress" ON weekly_progress;
CREATE POLICY "Users can insert weekly_progress"
    ON weekly_progress FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update weekly_progress" ON weekly_progress;
CREATE POLICY "Users can update weekly_progress"
    ON weekly_progress FOR UPDATE
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Users can delete weekly_progress" ON weekly_progress;
CREATE POLICY "Users can delete weekly_progress"
    ON weekly_progress FOR DELETE
    TO authenticated
    USING (true);

-- Create RLS policies for project_status_changes
DROP POLICY IF EXISTS "Users can view all project_status_changes" ON project_status_changes;
CREATE POLICY "Users can view all project_status_changes"
    ON project_status_changes FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Users can insert project_status_changes" ON project_status_changes;
CREATE POLICY "Users can insert project_status_changes"
    ON project_status_changes FOR INSERT
    TO authenticated
    WITH CHECK (true);