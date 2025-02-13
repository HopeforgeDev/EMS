import { ScheduleXCalendar } from '@schedule-x/react';
import scheduleX from '@schedule-x/calendar';
const { viewMonth } = scheduleX;
import { useLoaderData } from "react-router";



import { viewDay, viewWeek } from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/index.css';
import { createSignal } from 'solid-js';
import type { Timesheet } from '~/db/types';
import { validateTimesheet } from '~/utils/validation';
import { getDB } from '~/db/getDB';


export async function loader() {
  const db = await getDB();
  const timesheets = await db.all(`
    SELECT t.*, e.full_name 
    FROM timesheets t
    JOIN employees e ON t.employee_id = e.id
  `);
  return { timesheets };
}

export default function TimesheetsPage() {
  const { timesheets } = useLoaderData();
  const [viewMode, setViewMode] = createSignal<'calendar' | 'table'>('table');

  const calendarEvents = timesheets.map(ts => ({
    id: ts.id,
    title: `${ts.full_name}: ${ts.summary || 'Work shift'}`,
    start: ts.start_time,
    end: ts.end_time,
    description: ts.summary,
  }));

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded ${viewMode() === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded ${viewMode() === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Calendar View
          </button>
        </div>
        <a href="/timesheets/new" className="bg-green-600 text-white px-4 py-2 rounded">
          ➕ New Timesheet
        </a>
      </div>

      {viewMode() === 'calendar' ? (
        <div className="schedule-x-container">
          <ScheduleXCalendar
            events={calendarEvents}
            views={[viewMonth, viewWeek, viewDay]}
            defaultView={viewWeek}
            calendarOptions={{
              locale: 'en-US',
              defaultView: 'week',
              style: 'height: 600px;'
            }}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Start Time</th>
                <th className="p-3 text-left">End Time</th>
                <th className="p-3 text-left">Summary</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {timesheets.map(ts => (
                <tr key={ts.id} className="hover:bg-gray-50">
                  <td className="p-3">{ts.full_name}</td>
                  <td className="p-3">{new Date(ts.start_time).toLocaleString()}</td>
                  <td className="p-3">{new Date(ts.end_time).toLocaleString()}</td>
                  <td className="p-3">{ts.summary || '-'}</td>
                  <td className="p-3">
                    <a href={`/timesheets/${ts.id}`} className="text-blue-600 hover:underline">
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <a href={`/employees`} className="text-blue-600 hover:underline">
          Employees
          </a>
        </div>
      )}
    </div>
  );
}

