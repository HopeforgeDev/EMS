import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfigPath = path.join(__dirname, '../database.yaml');
const dbConfig = yaml.load(fs.readFileSync(dbConfigPath, 'utf8'));

const {
  'sqlite_path': sqlitePath,
} = dbConfig;

const db = new sqlite3.Database(sqlitePath);

const employees = [
  {
    full_name: 'John Doe',
    email: 'johndoe@gmail.com',
    phone: '+1234567890',
    date_of_birth: '1990-01-01',
    job_title: 'Software Engineer',
    department: 'IT',
    salary: 5000,
    start_date: '2020-01-01'
  },
  {
    full_name: 'Moe Smith',
    email: 'moesmith@gmail.com',
    phone: '+1234567345',
    date_of_birth: '1995-09-10',
    job_title: 'Software Engineer',
    department: 'IT',
    salary: 4000,
    start_date: '2021-05-01'
  },
  {
    full_name: 'Wissam Dhaiby',
    email: 'wissamdhaiby@gmail.com',
    phone: '+1265467890',
    date_of_birth: '1998-03-11',
    job_title: 'Senior Talent Acquisition Specialist',
    department: 'HR',
    salary: 3500,
    start_date: '2019-09-01'
  },
  {
    full_name: 'Walid AbiSaab',
    email: 'walidabisaab@gmail.com',
    phone: '+1234809890',
    date_of_birth: '2001-07-12',
    job_title: 'Software Engineer',
    department: 'IT',
    salary: 3000,
    start_date: '2022-01-01'
  },
  
];

const timesheets = [
  {
    employee_id: 1,
    start_time: '2025-01-05 08:00:00',
    end_time: '2025-01-05 17:00:00',
    summary: 'Worked on project A'
  },
  {
    employee_id: 1,
    start_time: '2025-02-10 08:00:00',
    end_time: '2025-02-10 17:00:00',
    summary: 'Worked on project B'
  },
  {
    employee_id: 2,
    start_time: '2025-02-02 08:00:00',
    end_time: '2025-02-02 17:00:00',
    summary: 'Worked on project C'
  },
  {
    employee_id: 2,
    start_time: '2025-02-03 08:00:00',
    end_time: '2025-02-03 17:00:00',
    summary: 'Worked on project C'
  },
  {
    employee_id: 4,
    start_time: '2025-02-11 08:00:00',
    end_time: '2025-02-11 17:00:00',
    summary: 'Worked on project D'
  },
];

const insertData = (table, data) => {
  const columns = Object.keys(data[0]).join(', ');
  const placeholders = Object.keys(data[0]).map(() => '?').join(', ');

  const insertStmt = db.prepare(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`);

  data.forEach(row => {
    insertStmt.run(Object.values(row));
  });

  insertStmt.finalize();
};

db.serialize(() => {
  insertData('employees', employees);
  insertData('timesheets', timesheets);
});

db.close(err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Database seeded successfully.');
  }
});

