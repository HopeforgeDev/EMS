import { useLoaderData, useSearchParams } from "react-router";
import { getDB } from "~/db/getDB";
import { useState } from 'react';
import { BsSearch } from 'react-icons/bs';


export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';
  const sortParam = url.searchParams.get('sort') || 'id';
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = 10;

  // Validate sort parameter
  const allowedSorts = ['id', 'full_name', 'department', 'salary', 'start_date'];
  const sort = allowedSorts.includes(sortParam) ? sortParam : 'id';

  const db = await getDB();
  const offset = (page - 1) * limit;

  // Main query with comprehensive search
  const employees_list = await db.all(`
    SELECT id, full_name, job_title, department, salary 
    FROM employees
    WHERE 
      CAST(salary AS TEXT) LIKE '%' || ? || '%' OR
      full_name LIKE '%' || ? || '%' OR
      email LIKE '%' || ? || '%' OR
      department LIKE '%' || ? || '%' OR
      CAST(start_date AS TEXT) LIKE '%' || ? || '%'
    ORDER BY ${sort}
    LIMIT ? OFFSET ?
  `, [search, search, search, search, search, limit, offset]);

    console.log(employees_list);

  // Count query with same search criteria
  const { total } = await db.get(`
    SELECT COUNT(*) as total FROM employees
    WHERE 
      CAST(salary AS TEXT) LIKE '%' || ? || '%' OR
      full_name LIKE '%' || ? || '%' OR
      email LIKE '%' || ? || '%' OR
      department LIKE '%' || ? || '%' OR
      CAST(start_date AS TEXT) LIKE '%' || ? || '%'
  `, [search, search, search, search, search]);

  return { employees_list, search, total, page, limit };
}

export default function EmployeesPage() {
  const { employees_list, search, total, page, limit } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  const [employees, setEmployees] = useState(employees_list);
  const [searchVal, setSearchVal] = useState("Department");
  console.log(sort);

  function handleSearchClick() {
      if (searchVal === "") { setEmployees(employees_list); return; }
      var filterBySearch = employees_list.filter((emp) => {
        if (emp.full_name.toLowerCase().includes(searchVal.toLowerCase()) && search == "Name") { return item; }
      })
      filterBySearch = employees_list.filter((emp) => {
        if (String(emp.salary).toLowerCase().includes(searchVal.toLowerCase()) && search == "Salary") { return item; }
      })
      filterBySearch = employees_list.filter((emp) => {
        if (emp.departmrnt.toLowerCase().includes(searchVal.toLowerCase()) && search == "Department") { return item; }
      })
    setEmployees(filterBySearch);
  }


  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search employees..."
          className="flex-1 border p-2 rounded"
          value={searchParams.get('search') || ''}
          onChange={e => setSearchParams({ 
            search: e.target.value,
            sort: searchParams.get('sort') || 'id',
            page: '1' // Reset to first page on new search
          })}
        />
        
        <BsSearch onClick={handleSearchClick} />

        <select
          className="border p-2 rounded"
          value={searchParams.get('sort') || 'id'}
          onChange={e => setSearchParams({ 
            sort: e.target.value,
            search: searchParams.get('search') || '',
            page: '1' // Reset to first page on new sort
          })}
        >
          <option value="full_name">Name</option>
          <option value="department">Department</option>
          <option value="salary">Salary</option>
          <option value="start_date">Start Date</option>
        </select>
        <a href="/employees/new" className="bg-green-600 text-white px-4 py-2 rounded">
          ➕ New Employee
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              {['Name', 'Job Title', 'Department', 'Salary', 'Actions'].map((h) => (
                <th key={h} className="p-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="p-3">{emp.full_name}</td>
                <td className="p-3">{emp.job_title}</td>
                <td className="p-3">{emp.department}</td>
                <td className="p-3">${emp.salary.toLocaleString()}</td>
                <td className="p-3">
                  <a href={`/employees/${emp.id}`} className="text-blue-600 hover:underline">
                    Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <span>Showing {(page-1)*limit+1} - {Math.min(page*limit, total)} of {total}</span>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setSearchParams(p => ({ 
              ...Object.fromEntries(p.entries()),
              page: page - 1 
            }))}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={page * limit >= total}
            onClick={() => setSearchParams(p => ({ 
              ...Object.fromEntries(p.entries()),
              page: page + 1 
            }))}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
          <a href={`/timesheets`} className="text-blue-600 hover:underline">
            TimeSheets
          </a>
        </div>
      </div>
    </div>
  );
}