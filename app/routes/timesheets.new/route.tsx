import { Form, redirect, useActionData, useLoaderData } from "react-router-dom";
import { getDB } from "~/db/getDB";
import { validateTimesheet } from "~/utils/validation";
import type { Employee, Timesheet } from '~/db/types';

// Type definitions for loader/action data
interface LoaderData {
  employees: Pick<Employee, 'id' | 'full_name'>[];
}

interface ActionData {
  errors?: Record<string, string>;
}

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as unknown as Timesheet;
  const validation = validateTimesheet(data);

  if (validation.errors) {
    return validation.errors;
  }

  try {
    const db = await getDB();
    await db.run(
      `INSERT INTO timesheets (
        employee_id, start_time, end_time, summary
      ) VALUES (?, ?, ?, ?)`,
      [data.employee_id, data.start_time, data.end_time, data.summary]
    );
    return redirect("/timesheets");
  } catch (error) {
    console.error('Timesheet creation failed:', error);
    return { errors: { database: 'Failed to save timesheet' } };
  }
};

export const loader = async () => {
  try {
    const db = await getDB();
    const employees = await db.all<Pick<Employee, 'id' | 'full_name'>[]>(
      'SELECT id, full_name FROM employees'
    );
    return { employees };
  } catch (error) {
    console.error('Failed to load employees:', error);
    return { employees: [] };
  }
};

export default function NewTimesheetPage() {
  const { employees } = useLoaderData() as LoaderData;
  const errors = useActionData() as ActionData;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">New Timesheet</h1>
      <Form method="post" className="space-y-4">
        {/* Employee Selection */}
        <div>
          <label className="block mb-2">Employee*</label>
          <select
            name="employee_id"
            className="w-full border p-2 rounded"
            required
          >
            {employees.length === 0 ? (
              <option disabled value="">No employees available</option>
            ) : (
              employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Time Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Start Time*</label>
            <input
              type="datetime-local"
              name="start_time"
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">End Time*</label>
            <input
              type="datetime-local"
              name="end_time"
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>

        {/* Error Display */}
        {errors?.errors && (
          <div className="text-red-600 space-y-2">
            {Object.entries(errors.errors).map(([field, message]) => (
              <p key={field}>{message}</p>
            ))}
          </div>
        )}

        {/* Summary */}
        <div>
          <label className="block mb-2">Work Summary</label>
          <textarea
            name="summary"
            className="w-full border p-2 rounded h-32"
            placeholder="Describe work performed..."
          />
        </div>

        {/* Form Controls */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Save Timesheet
          </button>
          <a
            href="/timesheets"
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Cancel
          </a>
        </div>
      </Form>
    </div>
  );
}