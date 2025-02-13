# Employee Management System

A full-stack web application for HR personnel to manage employee records and timesheets, built with Remix and SQLite.

## Features

### Core Requirements
- **Employee Management**
  - Create/update employee records with personal/professional info
  - Form validation (email, phone, age, salary minimum)
  - File uploads for photos and documents
  - Compliance checks (18+ age verification)
  
- **Timesheet Management**
  - Create/update timesheets with time range validation
  - Calendar view using Schedule X
  - Table view with sorting/filtering
  
- **Dashboard Views**
  - Employee list with search and pagination
  - Timesheet calendar/table toggle
  - Navigation between resources

### Bonus Features Implemented
- Employee photo/document storage
- Timesheet calendar integration
- Search/filter/pagination
- Compliance validations
- File upload handling
- Responsive UI with Tailwind CSS

## Tech Stack

**Frontend**
- Remix (React)
- React Router
- Schedule X (Calendar)
- Tailwind CSS

**Backend**
- Remix Node.js Adapter
- Better SQLite3
- SQLite Database

**Tooling**
- TypeScript
- Esbuild
- Prettier

## Installation

### Prerequisites
- Node.js 18+
- npm 9+

### Setup
```bash
# Clone repository
git clone https://github.com/HopeforgeDev/EMS.git
cd EMS

# Install dependencies
npm install

# Create database and tables
npm run setup_db

# Seed sample data
npm run seed

# Create uploads directory
mkdir -p public/uploads

# Start development server
npm run dev
