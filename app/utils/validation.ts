import type { Employee, Timesheet } from '~/db/types';

export function validateEmployee(data: Partial<Employee>) {
  const errors: Record<string, string> = {};
  const REQUIRED_FIELDS = [
    'full_name', 'email', 'phone', 'date_of_birth',
    'job_title', 'department', 'salary', 'start_date'
  ];

  // Required fields check
  REQUIRED_FIELDS.forEach(field => {
    if (!data || !data[field as keyof Employee]) {
      errors[field] = 'This field is required';
    }
  });

  // Email validation
  if (data?.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }

  // Phone validation (basic international format)
  if (data?.phone && !/^\+\d{1,3}\d{6,14}$/.test(data.phone)) {
    errors.phone = 'Invalid phone number format';
  }

  // Age validation
  if (data?.date_of_birth) {
    const dob = new Date(data.date_of_birth);
    const ageDiff = Date.now() - dob.getTime();
    const ageDate = new Date(ageDiff);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    
    if (age < 18) {
      errors.date_of_birth = 'Employee must be at least 18 years old';
    }
  }

  // Salary validation
  if (data?.salary && data.salary < 1000) {
    errors.salary = 'Salary must be at least $1000';
  }

  return Object.keys(errors).length ? errors : null;
}

export function validateTimesheet(data: Partial<Timesheet>) {
  const errors: Record<string, string> = {};
  
  if (!data?.employee_id) {
    errors.employee_id = 'Employee selection is required';
  }

  if (data?.start_time && data?.end_time) {
    const start = new Date(data.start_time);
    const end = new Date(data.end_time);
    
    if (start >= end) {
      errors.time = 'End time must be after start time';
    }

    if (end.getTime() - start.getTime() > 14 * 60 * 60 * 1000) {
      errors.duration = 'Shift cannot exceed 14 hours';
    }
  }

  return Object.keys(errors).length ? errors : null;
}