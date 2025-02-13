import { Form } from "react-router";
import type { Employee } from "~/db/types";

export default function EmployeeForm({ employee }: { employee?: Employee }) {
  return (
    <Form method="post" className="grid grid-cols-2 gap-4" encType="multipart/form-data">
      {/* Personal Info */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold">Personal Information</h2>
        <div>
          <label>Full Name*</label>
          <input type="text" name="full_name" defaultValue={employee?.full_name} required />
        </div>
        {/* Add all other fields */}
        <div>
          <label>Email*</label>
          <input type="email" name="email" defaultValue={employee?.email} required />
        </div>
        <div>
          <label>Phone*</label>
          <input type="tel" name="phone" defaultValue={employee?.phone} required />
        </div>
        <div>
          <label>Date of Birth*</label>
          <input type="date" name="date_of_birth" defaultValue={employee?.date_of_birth} required />
        </div>
      </div>

      {/* Professional Info */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold">Professional Information</h2>
        <div>
          <label>Job Title*</label>
          <input type="text" name="job_title" defaultValue={employee?.job_title} required />
        </div>
        <div>
          <label>Department*</label>
          <input type="text" name="department" defaultValue={employee?.department} required />
        </div>
        <div>
          <label>Salary*</label>
          <input type="number" name="salary" defaultValue={employee?.salary} required />
        </div>
        <div>
          <label>Start Date*</label>
          <input type="date" name="start_date" defaultValue={employee?.start_date} required />
        </div>
        <div>
          <label>End Date</label>
          <input type="date" name="end_date" defaultValue={employee?.end_date} />
        </div>
      </div>

      {/* File Uploads */}
      <div className="col-span-2 space-y-2">
        <h2 className="text-lg font-bold">Attachments</h2>
        <div>
          <label>Photo</label>
          <input type="file" name="photo" accept="image/*" required/>
        </div>
        <div>
          <label>Documents</label>
          <input type="file" name="documents" multiple required/>
        </div>
      </div>

      <div className="col-span-2 flex gap-4">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save
        </button>
        <a href="/employees" className="bg-gray-500 text-white px-4 py-2 rounded">
          Cancel
        </a>
      </div>
    </Form>
  );
}