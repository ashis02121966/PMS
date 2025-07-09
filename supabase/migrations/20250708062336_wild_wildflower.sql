/*
  # Fix Row Level Security Policies for Demo Application

  This migration updates the RLS policies to allow unauthenticated access for demo purposes.
  In a production environment, you would want proper authentication.

  ## Changes
  - Update all RLS policies to allow public access
  - Remove authentication requirements for CRUD operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all projects" ON projects;
DROP POLICY IF EXISTS "Users can insert projects" ON projects;
DROP POLICY IF EXISTS "Users can update projects" ON projects;
DROP POLICY IF EXISTS "Users can delete projects" ON projects;

DROP POLICY IF EXISTS "Users can view all resources" ON resources;
DROP POLICY IF EXISTS "Users can insert resources" ON resources;
DROP POLICY IF EXISTS "Users can update resources" ON resources;
DROP POLICY IF EXISTS "Users can delete resources" ON resources;

DROP POLICY IF EXISTS "Users can view all payment_milestones" ON payment_milestones;
DROP POLICY IF EXISTS "Users can insert payment_milestones" ON payment_milestones;
DROP POLICY IF EXISTS "Users can update payment_milestones" ON payment_milestones;
DROP POLICY IF EXISTS "Users can delete payment_milestones" ON payment_milestones;

DROP POLICY IF EXISTS "Users can view all issues" ON issues;
DROP POLICY IF EXISTS "Users can insert issues" ON issues;
DROP POLICY IF EXISTS "Users can update issues" ON issues;
DROP POLICY IF EXISTS "Users can delete issues" ON issues;

DROP POLICY IF EXISTS "Users can view all weekly_progress" ON weekly_progress;
DROP POLICY IF EXISTS "Users can insert weekly_progress" ON weekly_progress;
DROP POLICY IF EXISTS "Users can update weekly_progress" ON weekly_progress;
DROP POLICY IF EXISTS "Users can delete weekly_progress" ON weekly_progress;

DROP POLICY IF EXISTS "Users can view all project_status_changes" ON project_status_changes;
DROP POLICY IF EXISTS "Users can insert project_status_changes" ON project_status_changes;

-- Create new policies that allow public access for demo purposes
-- Projects policies
CREATE POLICY "Allow public access to projects" ON projects FOR ALL USING (true) WITH CHECK (true);

-- Resources policies
CREATE POLICY "Allow public access to resources" ON resources FOR ALL USING (true) WITH CHECK (true);

-- Payment milestones policies
CREATE POLICY "Allow public access to payment_milestones" ON payment_milestones FOR ALL USING (true) WITH CHECK (true);

-- Issues policies
CREATE POLICY "Allow public access to issues" ON issues FOR ALL USING (true) WITH CHECK (true);

-- Weekly progress policies
CREATE POLICY "Allow public access to weekly_progress" ON weekly_progress FOR ALL USING (true) WITH CHECK (true);

-- Project status changes policies
CREATE POLICY "Allow public access to project_status_changes" ON project_status_changes FOR ALL USING (true) WITH CHECK (true);