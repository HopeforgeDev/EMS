import { Form, redirect, useLoaderData, useActionData } from "react-router-dom";
import { getDB } from "~/db/getDB";
import { validateTimesheet } from "~/utils/validation";
import type { TimesheetWithEmployee } from "~/db/types";

export const loader = async ({ params }: { params: { timesheetId: string } }) => {
  const db = await getDB();
  const timesheet = await db.get<TimesheetWithEmployee>(
    `SELECT t.*, e.full_name 
     FROM timesheets t
     JOIN employees e ON t.employee_id = e.id
     WHERE t.id = ?`,
    params.timesheetId
  );

  if (!timesheet) throw new Response("Timesheet not found", { status: 404 });
  
  return { timesheet };
};

export const action = async ({ request, params }: { 
  request: Request;
  params: { timesheetId: string };
}) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const validation = validateTimesheet(data);
  
  if (validation.errors) return validation.errors;

  try {
    const db = await getDB();
    await db.run(
      `UPDATE timesheets SET
        employee_id = ?,
        start_time = ?,
        end_time = ?,
        summary = ?
       WHERE id = ?`,
      [
        data.employee_id,
        data.start_time,
        data.end_time,
        data.summary,
        params.timesheetId
      ]
    );
    return redirect(`/timesheets/${params.timesheetId}`);
  } catch (error) {
    console.error('Update failed:', error);
    return { error: 'Failed to update timesheet' };
  }
};

export default function TimesheetDetailPage() {
  const { timesheet } = useLoaderData() as { timesheet: TimesheetWithEmployee };
  const errors = useActionData() as { errors?: Record<string, string> };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Timesheet</h1>
      
      <Form method="post" className="space-y-4">
        <div>
          <label className="block mb-2">Employee</label>
          <input
            type="text"
            value={timesheet.full_name}
            className="w-full border p-2 rounded bg-gray-50"
            readOnly
          />
          <input
            type="number"
            name="employee_id"
            value={timesheet.employee_id}
            className="w-full border p-2 rounded bg-gray-50"
            readOnly
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Start Time*</label>
            <input
              type="datetime-local"
              name="start_time"
              defaultValue={new Date(timesheet.start_time).toISOString().slice(0, 16)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">End Time*</label>
            <input
              type="datetime-local"
              name="end_time"
              defaultValue={new Date(timesheet.end_time).toISOString().slice(0, 16)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>

        {errors?.errors?.time && (
          <div className="text-red-600">{errors.errors.time}</div>
        )}

        <div>
          <label className="block mb-2">Work Summary</label>
          <textarea
            name="summary"
            defaultValue={timesheet.summary || ''}
            className="w-full border p-2 rounded h-32"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
          <a
            href="/timesheets"
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Cancel
          </a>
        </div>
      </Form>
    </div>
  );
}

export const ErrorBoundary = () => (
  <div className="p-4 bg-red-100 text-red-700">
    Error loading timesheet data
  </div>
);