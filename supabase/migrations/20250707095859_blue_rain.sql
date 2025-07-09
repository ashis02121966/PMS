/*
  # Insert Sample Data

  1. Sample Projects
    - E-commerce Platform Redesign (Green, Active, 75% progress)
    - Customer Portal Development (Amber, Active, 45% progress)
    - Mobile App Development (Red, Hold, 20% progress)
    - Legacy System Migration (Green, Completed, 100% progress)

  2. Associated Data
    - Resources for each project
    - Payment milestones with various statuses
    - Issues with different severities and statuses
    - Weekly progress tracking data
*/

-- Insert sample projects
INSERT INTO projects (id, name, description, start_date, end_date, project_value, currency, status, project_status, progress, status_comment, status_changed_by, status_changed_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'E-commerce Platform Redesign', 'Complete overhaul of the existing e-commerce platform with modern UI/UX', '2024-01-15', '2024-06-30', 20750000, 'INR', 'green', 'active', 75, NULL, NULL, NULL),
('550e8400-e29b-41d4-a716-446655440002', 'Customer Portal Development', 'Self-service customer portal with account management features', '2024-02-01', '2024-07-15', 14940000, 'INR', 'amber', 'active', 45, NULL, NULL, NULL),
('550e8400-e29b-41d4-a716-446655440003', 'Mobile App Development', 'Native mobile application for iOS and Android platforms', '2024-03-01', '2024-09-30', 26560000, 'INR', 'red', 'hold', 20, 'Project on hold due to budget constraints and resource reallocation', 'Project Manager', '2024-04-10T00:00:00Z'),
('550e8400-e29b-41d4-a716-446655440004', 'Legacy System Migration', 'Migration of legacy banking system to modern cloud infrastructure', '2023-09-01', '2024-03-31', 41500000, 'INR', 'green', 'completed', 100, 'Project completed successfully with all deliverables met', 'Project Director', '2024-03-31T00:00:00Z');

-- Insert sample resources
INSERT INTO resources (id, project_id, name, role, allocation, hourly_rate) VALUES
-- E-commerce Platform Redesign resources
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Rajesh Kumar', 'Project Manager', 100, 2500.00),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Priya Sharma', 'Frontend Developer', 80, 2000.00),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Amit Patel', 'Backend Developer', 90, 2200.00),

-- Customer Portal Development resources
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Sarah Wilson', 'Lead Developer', 100, 2800.00),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Tom Brown', 'UI/UX Designer', 60, 1800.00),
('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Lisa Chen', 'QA Engineer', 70, 1600.00),

-- Mobile App Development resources
('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 'David Lee', 'Mobile Developer', 100, 2400.00),
('650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 'Emma Davis', 'Mobile Developer', 100, 2400.00),
('650e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'Alex Rodriguez', 'Backend Developer', 50, 2200.00),

-- Legacy System Migration resources
('650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440004', 'Rajesh Kumar', 'Technical Lead', 100, 3000.00),
('650e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440004', 'Priya Sharma', 'System Architect', 90, 2800.00),
('650e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440004', 'Amit Patel', 'DevOps Engineer', 80, 2600.00);

-- Insert sample payment milestones
INSERT INTO payment_milestones (id, project_id, name, amount, due_date, status, completed_date) VALUES
-- E-commerce Platform Redesign milestones
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Project Kickoff', 4150000, '2024-02-01', 'completed', '2024-01-30'),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Phase 1 Completion', 6225000, '2024-03-15', 'completed', '2024-03-10'),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Phase 2 Completion', 6225000, '2024-05-01', 'completed', '2024-04-28'),
('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Final Delivery', 4150000, '2024-06-30', 'pending', NULL),

-- Customer Portal Development milestones
('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Discovery Phase', 2490000, '2024-02-15', 'completed', '2024-02-12'),
('750e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Design Approval', 3735000, '2024-03-30', 'completed', '2024-04-02'),
('750e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'Development Phase 1', 4980000, '2024-05-15', 'overdue', NULL),
('750e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', 'Final Delivery', 3735000, '2024-07-15', 'pending', NULL),

-- Mobile App Development milestones
('750e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'Project Setup', 4150000, '2024-03-15', 'completed', '2024-03-12'),
('750e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', 'MVP Development', 8300000, '2024-05-01', 'overdue', NULL),
('750e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440003', 'Beta Testing', 8300000, '2024-07-15', 'pending', NULL),
('750e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440003', 'App Store Release', 5810000, '2024-09-30', 'pending', NULL),

-- Legacy System Migration milestones
('750e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440004', 'System Analysis', 8300000, '2023-10-15', 'completed', '2023-10-12'),
('750e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440004', 'Infrastructure Setup', 12450000, '2023-12-31', 'completed', '2023-12-28'),
('750e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440004', 'Data Migration', 12450000, '2024-02-29', 'completed', '2024-02-25'),
('750e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440004', 'Go-Live & Support', 8300000, '2024-03-31', 'completed', '2024-03-31');

-- Insert sample issues
INSERT INTO issues (id, project_id, title, description, severity, status, assigned_to, category, week_number, year, resolved_at) VALUES
-- E-commerce Platform Redesign issues
('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Payment gateway integration issues', 'Issues with Razorpay API integration', 'high', 'resolved', 'Amit Patel', 'bug', 12, 2024, '2024-03-25T00:00:00Z'),
('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Mobile responsiveness fixes', 'Cart page not responsive on mobile devices', 'medium', 'in-progress', 'Priya Sharma', 'bug', 15, 2024, NULL),

-- Customer Portal Development issues
('850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Database performance optimization', 'Slow query performance on user dashboard', 'high', 'open', 'Sarah Wilson', 'bug', 15, 2024, NULL),
('850e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Authentication system enhancement', 'Add two-factor authentication', 'medium', 'in-progress', 'Sarah Wilson', 'feature', 13, 2024, NULL),
('850e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'UI inconsistencies', 'Button styles not consistent across pages', 'low', 'open', 'Tom Brown', 'improvement', 15, 2024, NULL),

-- Mobile App Development issues
('850e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', 'Critical app crash on startup', 'App crashes when launched on iOS 17', 'critical', 'open', 'David Lee', 'bug', 14, 2024, NULL),
('850e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 'Push notification system', 'Implement push notification service', 'high', 'open', 'Alex Rodriguez', 'feature', 13, 2024, NULL),
('850e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 'Performance optimization needed', 'App loading time is too slow', 'medium', 'in-progress', 'Emma Davis', 'improvement', 14, 2024, NULL),

-- Legacy System Migration issues
('850e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440004', 'Data validation errors', 'Some legacy data formats causing validation issues', 'medium', 'resolved', 'Priya Sharma', 'bug', 3, 2024, '2024-01-22T00:00:00Z'),
('850e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440004', 'Performance optimization', 'System performance tuning for better response times', 'low', 'resolved', 'Amit Patel', 'improvement', 6, 2024, '2024-02-18T00:00:00Z');

-- Insert sample weekly progress
INSERT INTO weekly_progress (id, project_id, week_number, year, progress, issues_resolved, issues_created, milestones_completed) VALUES
-- E-commerce Platform Redesign progress
('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 10, 2024, 10, 0, 1, 1),
('950e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 11, 2024, 25, 0, 0, 0),
('950e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 12, 2024, 40, 1, 1, 1),
('950e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 13, 2024, 55, 0, 0, 0),
('950e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 14, 2024, 70, 1, 0, 1),
('950e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 15, 2024, 75, 0, 0, 0),

-- Customer Portal Development progress
('950e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 10, 2024, 8, 0, 0, 1),
('950e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', 11, 2024, 15, 0, 1, 0),
('950e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440002', 12, 2024, 28, 0, 2, 1),
('950e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', 13, 2024, 35, 0, 0, 0),
('950e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440002', 14, 2024, 42, 1, 1, 0),
('950e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', 15, 2024, 45, 0, 0, 0),

-- Mobile App Development progress
('950e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440003', 10, 2024, 5, 0, 0, 1),
('950e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440003', 11, 2024, 8, 0, 1, 0),
('950e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440003', 12, 2024, 12, 0, 2, 0),
('950e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440003', 13, 2024, 15, 0, 1, 0),
('950e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440003', 14, 2024, 18, 0, 0, 0),
('950e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440003', 15, 2024, 20, 0, 0, 0),

-- Legacy System Migration progress
('950e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440004', 1, 2024, 85, 0, 1, 0),
('950e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440004', 2, 2024, 88, 1, 0, 0),
('950e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440004', 3, 2024, 92, 0, 1, 1),
('950e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440004', 4, 2024, 95, 1, 0, 0),
('950e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440004', 5, 2024, 98, 0, 0, 0),
('950e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440004', 6, 2024, 100, 0, 0, 1);