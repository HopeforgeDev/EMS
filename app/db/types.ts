export interface Employee {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    job_title: string;
    department: string;
    salary: number;
    start_date: string;
    end_date?: string;
    photo_path?: string;
    documents_path?: string;
  }
  
  export interface Timesheet {
    id: number;
    employee_id: number;
    start_time: string;
    end_time: string;
    summary?: string;
  }
  
  export interface TimesheetWithEmployee extends Timesheet {
    full_name: string;
  }