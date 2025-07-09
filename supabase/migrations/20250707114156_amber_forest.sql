/*
  # Add Comprehensive Dummy Data

  This migration adds realistic dummy data for all tables to demonstrate the application functionality.

  ## Data Added
  1. **Projects** - 6 diverse projects with different statuses and progress levels
  2. **Resources** - Team members assigned to projects with various roles
  3. **Payment Milestones** - Project payment schedules with different statuses
  4. **Issues** - Various bugs, features, and improvements across projects
  5. **Weekly Progress** - Historical progress tracking data
  6. **Project Status Changes** - Audit trail of status changes

  ## Features Demonstrated
  - Multiple project types (web, mobile, enterprise)
  - Different project statuses and health indicators
  - Resource allocation and team management
  - Payment milestone tracking
  - Issue management with severity levels
  - Progress tracking over time
*/

-- Clear existing data first
DELETE FROM project_status_changes;
DELETE FROM weekly_progress;
DELETE FROM issues;
DELETE FROM payment_milestones;
DELETE FROM resources;
DELETE FROM projects;

-- Insert comprehensive project data
INSERT INTO projects (id, name, description, start_date, end_date, project_value, currency, status, project_status, progress, status_comment, status_changed_by, status_changed_at) VALUES
-- Active Projects
('550e8400-e29b-41d4-a716-446655440001', 'E-commerce Platform Redesign', 'Complete overhaul of the existing e-commerce platform with modern UI/UX, improved performance, and mobile-first design approach', '2024-01-15', '2024-06-30', 25000000, 'INR', 'green', 'active', 78, NULL, NULL, NULL),

('550e8400-e29b-41d4-a716-446655440002', 'Customer Portal Development', 'Self-service customer portal with account management, order tracking, support tickets, and real-time notifications', '2024-02-01', '2024-07-15', 18500000, 'INR', 'amber', 'active', 52, 'Minor delays due to third-party API integration challenges', 'Sarah Wilson', '2024-12-15T10:30:00Z'),

('550e8400-e29b-41d4-a716-446655440003', 'Mobile Banking App', 'Secure mobile banking application with biometric authentication, real-time transactions, and investment tracking', '2024-03-01', '2024-09-30', 35000000, 'INR', 'red', 'hold', 25, 'Project on hold due to regulatory compliance review and security audit requirements', 'Project Director', '2024-12-20T14:45:00Z'),

-- Completed Projects
('550e8400-e29b-41d4-a716-446655440004', 'Legacy System Migration', 'Migration of legacy banking system to modern cloud infrastructure with improved scalability and security', '2023-09-01', '2024-03-31', 45000000, 'INR', 'green', 'completed', 100, 'Project completed successfully with all deliverables met and client satisfaction achieved', 'Project Director', '2024-03-31T16:00:00Z'),

-- New Projects
('550e8400-e29b-41d4-a716-446655440005', 'AI Analytics Dashboard', 'Advanced analytics dashboard with machine learning insights, predictive modeling, and real-time data visualization', '2024-11-01', '2025-04-30', 28000000, 'INR', 'green', 'active', 15, NULL, NULL, NULL),

('550e8400-e29b-41d4-a716-446655440006', 'Supply Chain Management System', 'Comprehensive supply chain management platform with inventory tracking, vendor management, and logistics optimization', '2024-12-01', '2025-08-31', 42000000, 'INR', 'amber', 'active', 8, 'Initial setup phase with some vendor onboarding delays', 'Operations Manager', '2024-12-28T09:15:00Z');

-- Insert comprehensive resources data
INSERT INTO resources (id, project_id, name, role, allocation, hourly_rate) VALUES
-- E-commerce Platform Redesign Team
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Rajesh Kumar', 'Project Manager', 100, 3000.00),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Priya Sharma', 'Frontend Developer', 90, 2500.00),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Amit Patel', 'Backend Developer', 85, 2800.00),
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Sneha Reddy', 'UI/UX Designer', 75, 2200.00),

-- Customer Portal Development Team
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Sarah Wilson', 'Lead Developer', 100, 3200.00),
('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Tom Brown', 'Frontend Developer', 80, 2400.00),
('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'Lisa Chen', 'QA Engineer', 70, 2000.00),
('650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', 'Michael Rodriguez', 'DevOps Engineer', 60, 2600.00),

-- Mobile Banking App Team
('650e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'David Lee', 'Mobile Developer', 100, 2800.00),
('650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', 'Emma Davis', 'Mobile Developer', 100, 2800.00),
('650e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440003', 'Alex Rodriguez', 'Security Specialist', 90, 3500.00),
('650e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440003', 'Jennifer Kim', 'Compliance Officer', 50, 3000.00),

-- Legacy System Migration Team (Completed)
('650e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440004', 'Rajesh Kumar', 'Technical Lead', 100, 3500.00),
('650e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440004', 'Priya Sharma', 'System Architect', 95, 3200.00),
('650e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440004', 'Amit Patel', 'DevOps Engineer', 80, 2800.00),

-- AI Analytics Dashboard Team
('650e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440005', 'Dr. Ananya Singh', 'Data Scientist', 100, 4000.00),
('650e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440005', 'Vikram Gupta', 'ML Engineer', 90, 3500.00),
('650e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440005', 'Kavya Nair', 'Frontend Developer', 85, 2600.00),

-- Supply Chain Management Team
('650e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440006', 'Rohit Mehta', 'Project Manager', 100, 3200.00),
('650e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440006', 'Neha Agarwal', 'Business Analyst', 80, 2800.00),
('650e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440006', 'Karthik Iyer', 'Backend Developer', 75, 2700.00);

-- Insert comprehensive payment milestones
INSERT INTO payment_milestones (id, project_id, name, amount, due_date, status, completed_date) VALUES
-- E-commerce Platform Redesign Milestones
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Project Kickoff & Requirements', 5000000, '2024-02-01', 'completed', '2024-01-30'),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Design Phase Completion', 7500000, '2024-03-15', 'completed', '2024-03-12'),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Development Phase 1', 7500000, '2024-05-01', 'completed', '2024-04-28'),
('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Final Delivery & Testing', 5000000, '2024-06-30', 'pending', NULL),

-- Customer Portal Development Milestones
('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Discovery & Planning', 3700000, '2024-02-15', 'completed', '2024-02-12'),
('750e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'UI/UX Design Approval', 4625000, '2024-03-30', 'completed', '2024-04-02'),
('750e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'Core Development', 6175000, '2024-05-15', 'overdue', NULL),
('750e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', 'Integration & Deployment', 4000000, '2024-07-15', 'pending', NULL),

-- Mobile Banking App Milestones
('750e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'Security Framework Setup', 7000000, '2024-03-15', 'completed', '2024-03-12'),
('750e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', 'Core Banking Features', 14000000, '2024-05-01', 'overdue', NULL),
('750e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440003', 'Advanced Features & Testing', 10500000, '2024-07-15', 'pending', NULL),
('750e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440003', 'Compliance & Launch', 3500000, '2024-09-30', 'pending', NULL),

-- Legacy System Migration Milestones (All Completed)
('750e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440004', 'System Analysis & Planning', 9000000, '2023-10-15', 'completed', '2023-10-12'),
('750e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440004', 'Infrastructure Setup', 13500000, '2023-12-31', 'completed', '2023-12-28'),
('750e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440004', 'Data Migration & Testing', 13500000, '2024-02-29', 'completed', '2024-02-25'),
('750e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440004', 'Go-Live & Support', 9000000, '2024-03-31', 'completed', '2024-03-31'),

-- AI Analytics Dashboard Milestones
('750e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440005', 'Data Architecture Design', 5600000, '2024-12-01', 'completed', '2024-11-28'),
('750e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440005', 'ML Model Development', 8400000, '2025-01-31', 'pending', NULL),
('750e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440005', 'Dashboard Development', 8400000, '2025-03-15', 'pending', NULL),
('750e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440005', 'Integration & Deployment', 5600000, '2025-04-30', 'pending', NULL),

-- Supply Chain Management Milestones
('750e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440006', 'Requirements Gathering', 8400000, '2024-12-31', 'pending', NULL),
('750e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440006', 'System Architecture', 10500000, '2025-02-28', 'pending', NULL),
('750e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440006', 'Core Development', 14700000, '2025-05-31', 'pending', NULL),
('750e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440006', 'Testing & Deployment', 8400000, '2025-08-31', 'pending', NULL);

-- Insert comprehensive issues data
INSERT INTO issues (id, project_id, title, description, severity, status, assigned_to, category, week_number, year, resolved_at) VALUES
-- E-commerce Platform Issues
('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Payment Gateway Integration Timeout', 'Razorpay API calls timing out during high traffic periods, causing transaction failures', 'high', 'resolved', 'Amit Patel', 'bug', 12, 2024, '2024-03-25T14:30:00Z'),
('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Mobile Cart Responsiveness', 'Shopping cart page not displaying properly on mobile devices below 768px width', 'medium', 'in-progress', 'Priya Sharma', 'bug', 15, 2024, NULL),
('850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Product Search Enhancement', 'Implement advanced filtering and sorting options for product search', 'low', 'open', 'Sneha Reddy', 'feature', 16, 2024, NULL),

-- Customer Portal Issues
('850e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Database Query Performance', 'User dashboard loading slowly due to inefficient database queries', 'high', 'open', 'Sarah Wilson', 'bug', 15, 2024, NULL),
('850e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Two-Factor Authentication', 'Implement 2FA for enhanced security on customer accounts', 'medium', 'in-progress', 'Michael Rodriguez', 'feature', 13, 2024, NULL),
('850e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'UI Consistency Issues', 'Button styles and color schemes inconsistent across different pages', 'low', 'open', 'Tom Brown', 'improvement', 15, 2024, NULL),
('850e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'Email Notification System', 'Automated email notifications for order updates and account changes', 'medium', 'open', 'Lisa Chen', 'feature', 14, 2024, NULL),

-- Mobile Banking App Issues
('850e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 'Critical App Crash on iOS 17', 'Application crashes immediately upon launch on iOS 17 devices', 'critical', 'open', 'David Lee', 'bug', 14, 2024, NULL),
('850e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'Biometric Authentication Setup', 'Implement fingerprint and face recognition for secure login', 'high', 'in-progress', 'Emma Davis', 'feature', 13, 2024, NULL),
('850e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', 'Transaction History Performance', 'Loading transaction history takes too long for accounts with many transactions', 'medium', 'open', 'Alex Rodriguez', 'improvement', 14, 2024, NULL),
('850e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440003', 'Regulatory Compliance Review', 'Complete security audit and compliance documentation for banking regulations', 'critical', 'open', 'Jennifer Kim', 'other', 12, 2024, NULL),

-- Legacy System Migration Issues (Resolved)
('850e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440004', 'Data Format Validation Errors', 'Legacy data formats causing validation issues during migration process', 'medium', 'resolved', 'Priya Sharma', 'bug', 3, 2024, '2024-01-22T16:45:00Z'),
('850e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440004', 'Performance Optimization', 'System performance tuning required for better response times', 'low', 'resolved', 'Amit Patel', 'improvement', 6, 2024, '2024-02-18T11:20:00Z'),

-- AI Analytics Dashboard Issues
('850e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440005', 'Data Pipeline Architecture', 'Design scalable data pipeline for real-time analytics processing', 'high', 'in-progress', 'Dr. Ananya Singh', 'feature', 48, 2024, NULL),
('850e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440005', 'ML Model Accuracy', 'Improve prediction accuracy of the recommendation engine', 'medium', 'open', 'Vikram Gupta', 'improvement', 49, 2024, NULL),

-- Supply Chain Management Issues
('850e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440006', 'Vendor API Integration', 'Integrate with multiple vendor systems for real-time inventory updates', 'high', 'open', 'Karthik Iyer', 'feature', 52, 2024, NULL),
('850e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440006', 'Requirements Documentation', 'Complete detailed requirements documentation for all modules', 'medium', 'in-progress', 'Neha Agarwal', 'other', 1, 2025, NULL);

-- Insert comprehensive weekly progress data
INSERT INTO weekly_progress (id, project_id, week_number, year, progress, issues_resolved, issues_created, milestones_completed) VALUES
-- E-commerce Platform Progress (Recent weeks)
('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 10, 2024, 15, 0, 1, 1),
('950e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 11, 2024, 28, 0, 0, 1),
('950e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 12, 2024, 42, 1, 1, 0),
('950e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 13, 2024, 55, 0, 0, 1),
('950e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 14, 2024, 68, 0, 1, 0),
('950e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 15, 2024, 75, 0, 1, 0),
('950e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', 16, 2024, 78, 0, 1, 0),

-- Customer Portal Progress
('950e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', 10, 2024, 12, 0, 0, 1),
('950e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440002', 11, 2024, 20, 0, 1, 0),
('950e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', 12, 2024, 32, 0, 2, 1),
('950e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440002', 13, 2024, 40, 0, 1, 0),
('950e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', 14, 2024, 48, 0, 1, 0),
('950e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440002', 15, 2024, 52, 0, 2, 0),

-- Mobile Banking App Progress
('950e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440003', 10, 2024, 8, 0, 0, 1),
('950e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440003', 11, 2024, 12, 0, 1, 0),
('950e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440003', 12, 2024, 18, 0, 2, 0),
('950e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440003', 13, 2024, 22, 0, 1, 0),
('950e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440003', 14, 2024, 25, 0, 2, 0),

-- Legacy System Migration Progress (Completed project)
('950e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440004', 1, 2024, 88, 0, 1, 0),
('950e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440004', 2, 2024, 92, 1, 0, 0),
('950e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440004', 3, 2024, 95, 1, 0, 1),
('950e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440004', 4, 2024, 98, 0, 0, 0),
('950e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440004', 5, 2024, 100, 1, 0, 1),

-- AI Analytics Dashboard Progress (New project)
('950e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440005', 45, 2024, 5, 0, 0, 0),
('950e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440005', 46, 2024, 8, 0, 1, 0),
('950e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440005', 47, 2024, 12, 0, 0, 0),
('950e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440005', 48, 2024, 15, 0, 1, 1),

-- Supply Chain Management Progress (Very new project)
('950e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440006', 49, 2024, 2, 0, 0, 0),
('950e8400-e29b-41d4-a716-446655440029', '550e8400-e29b-41d4-a716-446655440006', 50, 2024, 5, 0, 1, 0),
('950e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440006', 51, 2024, 6, 0, 0, 0),
('950e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440006', 52, 2024, 8, 0, 1, 0),
('950e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440006', 1, 2025, 8, 0, 1, 0);

-- Insert project status changes audit trail
INSERT INTO project_status_changes (id, project_id, old_status, new_status, comment, changed_by) VALUES
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'active', 'active', 'Status updated due to minor delays in third-party API integration. Working on resolution.', 'Sarah Wilson'),
('a50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'active', 'hold', 'Project placed on hold pending regulatory compliance review and security audit completion.', 'Project Director'),
('a50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'active', 'completed', 'Project successfully completed with all deliverables met and client approval received.', 'Project Director'),
('a50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440006', 'active', 'active', 'Minor delays in vendor onboarding process. Adjusting timeline accordingly.', 'Operations Manager');