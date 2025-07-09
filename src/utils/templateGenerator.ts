export class TemplateGenerator {
  static generateProjectTemplate(): string {
    const headers = [
      'Project Name',
      'Description', 
      'Start Date (YYYY-MM-DD)',
      'End Date (YYYY-MM-DD)',
      'Project Value (INR)',
      'Currency',
      'Status (green/amber/red)',
      'Project Status (active/inactive/hold/completed)',
      'Progress (%)',
      'Resource Name 1',
      'Resource Role 1',
      'Resource Allocation 1 (%)',
      'Resource Name 2',
      'Resource Role 2', 
      'Resource Allocation 2 (%)',
      'Resource Name 3',
      'Resource Role 3',
      'Resource Allocation 3 (%)',
      'Milestone 1 Name',
      'Milestone 1 Amount (INR)',
      'Milestone 1 Due Date (YYYY-MM-DD)',
      'Milestone 1 Status (pending/completed/overdue)',
      'Milestone 2 Name',
      'Milestone 2 Amount (INR)',
      'Milestone 2 Due Date (YYYY-MM-DD)',
      'Milestone 2 Status (pending/completed/overdue)',
      'Milestone 3 Name',
      'Milestone 3 Amount (INR)',
      'Milestone 3 Due Date (YYYY-MM-DD)',
      'Milestone 3 Status (pending/completed/overdue)'
    ];

    const sampleData = [
      'Sample E-commerce Project',
      'Complete redesign of online store with modern features and payment integration',
      '2024-01-15',
      '2024-06-30',
      '2075000',
      'INR',
      'green',
      'active',
      '75',
      'Rajesh Kumar',
      'Project Manager',
      '100',
      'Priya Sharma',
      'Frontend Developer',
      '80',
      'Amit Patel',
      'Backend Developer',
      '90',
      'Project Kickoff',
      '415000',
      '2024-02-01',
      'completed',
      'Phase 1 Completion',
      '830000',
      '2024-04-15',
      'pending',
      'Final Delivery',
      '830000',
      '2024-06-30',
      'pending'
    ];

    return headers.join(',') + '\n' + sampleData.map(field => `"${field}"`).join(',');
  }

  static generateIssuesTemplate(): string {
    const headers = ['title', 'description', 'severity', 'assigned_to', 'category'];
    const sampleData = [
      ['Payment Gateway Bug', 'Razorpay integration failing on checkout page', 'high', 'Rajesh Kumar', 'bug'],
      ['Mobile Responsive Design', 'Cart page not displaying properly on mobile devices', 'medium', 'Priya Sharma', 'feature'],
      ['Database Performance', 'Query optimization needed for user dashboard', 'critical', 'Amit Patel', 'improvement'],
      ['UI Enhancement', 'Update button styles for better consistency', 'low', 'Sarah Wilson', 'other']
    ];

    let csv = headers.join(',') + '\n';
    csv += sampleData.map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    
    return csv;
  }

  static downloadFile(content: string, filename: string, mimeType: string = 'text/csv;charset=utf-8;') {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.visibility = 'hidden';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}