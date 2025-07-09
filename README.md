# Project Management Dashboard

A comprehensive project management dashboard built with React, TypeScript, and SQLite for efficient project tracking and management.

## Features

### 🎯 Core Functionality
- **Project Management**: Create, edit, and track multiple projects
- **Resource Management**: Assign team members with roles and allocation percentages
- **Milestone Tracking**: Set and monitor payment milestones with status tracking
- **Issue Management**: Track bugs, features, and improvements with severity levels
- **Progress Monitoring**: Weekly progress tracking with visual charts
- **Status Management**: Project health indicators (Green/Amber/Red)

### 📊 Analytics & Reporting
- **Dashboard Overview**: Key metrics and project health summary
- **Analytics View**: Comprehensive charts and trend analysis
- **Progress Charts**: Visual representation of project progress over time
- **Issue Analytics**: Track issue creation and resolution trends
- **Financial Overview**: Project value and revenue tracking

### 💾 Data Management
- **SQLite Database**: Client-side SQLite database for data persistence
- **CSV Import/Export**: Import project data from Excel/CSV files
- **Bulk Operations**: Bulk upload of issues and project data
- **Data Templates**: Pre-built templates for easy data entry

### 🎨 User Experience
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Interactive Charts**: Powered by Chart.js for dynamic visualizations
- **Real-time Updates**: Instant data updates across all views

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (client-side with SQL.js)
- **Charts**: Chart.js + React Chart.js 2
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Date Handling**: date-fns

## Database Schema

### Tables
1. **projects** - Main project information
2. **resources** - Team members and allocations
3. **payment_milestones** - Project payment schedules
4. **issues** - Project issues and bugs
5. **weekly_progress** - Weekly progress tracking

### Key Features
- Foreign key relationships for data integrity
- Indexes for optimized query performance
- Check constraints for data validation
- Automatic timestamp updates via triggers

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Creating a Project
1. Navigate to the "Create Project" section
2. Fill in project details (name, description, dates, value)
3. Add team resources with roles and allocation percentages
4. Set payment milestones with amounts and due dates
5. Save the project

### Importing Data
1. Use the "Upload CSV" feature in project creation
2. Download the provided template for correct format
3. Fill in your project data in Excel/CSV format
4. Upload the file to auto-populate project fields

### Managing Issues
1. Go to project details and select the "Issues" tab
2. Add individual issues or use bulk upload
3. Track issue status, severity, and assignments
4. Monitor resolution progress

### Analytics
1. Visit the Analytics dashboard for comprehensive insights
2. Filter by project or time range
3. View progress trends, issue analytics, and financial metrics
4. Export data for external reporting

## Data Storage

The application uses SQLite for client-side data storage:
- **Persistence**: Data is stored in browser localStorage
- **Performance**: Optimized with indexes and efficient queries
- **Reliability**: ACID compliance and data integrity constraints
- **Portability**: Database can be exported/imported as needed

## Currency Support

The application is configured for Indian Rupee (INR) by default:
- Automatic formatting for Lakhs and Crores
- Support for multiple currencies (USD, EUR, GBP)
- Consistent currency display across all views

## Project Status Types

### Health Status
- **Green**: Project on track
- **Amber**: Minor issues or delays
- **Red**: Critical issues requiring attention

### Project Status
- **Active**: Currently in progress
- **Inactive**: Temporarily paused
- **Hold**: On hold due to external factors
- **Completed**: Successfully finished

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository or contact the development team.

---

Built with ❤️ using React, TypeScript, and SQLite