/*
  # Project Management Database Schema

  1. New Tables
    - `projects` - Main project information with health status tracking
    - `resources` - Team members assigned to projects with allocation percentages
    - `payment_milestones` - Project payment schedules and completion tracking
    - `issues` - Project issues, bugs, and feature requests with severity levels
    - `weekly_progress` - Weekly progress tracking with metrics
    - `project_status_changes` - Audit trail for project status changes

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
    - Proper foreign key relationships and constraints

  3. Features
    - Automatic timestamp updates via triggers
    - Check constraints for data validation
    - Indexes for optimized query performance
    - Support for Indian currency formatting
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  project_value BIGINT NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'green' CHECK (status IN ('red', 'amber', 'green')),
  project_status TEXT NOT NULL DEFAULT 'active' CHECK (project_status IN ('active', 'inactive', 'hold', 'completed')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status_comment TEXT,
  status_changed_at TIMESTAMPTZ,
  status_changed_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  allocation INTEGER NOT NULL DEFAULT 100 CHECK (allocation >= 0 AND allocation <= 100),
  hourly_rate DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Payment milestones table
CREATE TABLE IF NOT EXISTS payment_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount BIGINT NOT NULL DEFAULT 0,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue')),
  completed_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Issues table
CREATE TABLE IF NOT EXISTS issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved', 'closed')),
  assigned_to TEXT,
  category TEXT NOT NULL DEFAULT 'bug' CHECK (category IN ('bug', 'feature', 'improvement', 'other')),
  week_number INTEGER,
  year INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- Weekly progress table
CREATE TABLE IF NOT EXISTS weekly_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 53),
  year INTEGER NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  issues_resolved INTEGER NOT NULL DEFAULT 0,
  issues_created INTEGER NOT NULL DEFAULT 0,
  milestones_completed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, week_number, year)
);

-- Project status changes audit table
CREATE TABLE IF NOT EXISTS project_status_changes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  comment TEXT NOT NULL,
  changed_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
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

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_status_changes ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view all projects" ON projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert projects" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update projects" ON projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete projects" ON projects FOR DELETE TO authenticated USING (true);

CREATE POLICY "Users can view all resources" ON resources FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert resources" ON resources FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update resources" ON resources FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete resources" ON resources FOR DELETE TO authenticated USING (true);

CREATE POLICY "Users can view all payment_milestones" ON payment_milestones FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert payment_milestones" ON payment_milestones FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update payment_milestones" ON payment_milestones FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete payment_milestones" ON payment_milestones FOR DELETE TO authenticated USING (true);

CREATE POLICY "Users can view all issues" ON issues FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert issues" ON issues FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update issues" ON issues FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete issues" ON issues FOR DELETE TO authenticated USING (true);

CREATE POLICY "Users can view all weekly_progress" ON weekly_progress FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert weekly_progress" ON weekly_progress FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update weekly_progress" ON weekly_progress FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete weekly_progress" ON weekly_progress FOR DELETE TO authenticated USING (true);

CREATE POLICY "Users can view all project_status_changes" ON project_status_changes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert project_status_changes" ON project_status_changes FOR INSERT TO authenticated WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for projects table
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update resolved_at when issue status changes to resolved
CREATE OR REPLACE FUNCTION update_issue_resolved_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status IN ('resolved', 'closed') AND OLD.status NOT IN ('resolved', 'closed') THEN
        NEW.resolved_at = now();
    ELSIF NEW.status NOT IN ('resolved', 'closed') THEN
        NEW.resolved_at = NULL;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for issues table
CREATE TRIGGER update_issues_resolved_at 
    BEFORE UPDATE ON issues 
    FOR EACH ROW 
    EXECUTE FUNCTION update_issue_resolved_at();