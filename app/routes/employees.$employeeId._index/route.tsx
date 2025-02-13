import { Form, redirect, useLoaderData, useActionData } from "react-router-dom";
import { getDB } from "~/db/getDB";
import { validateEmployee } from "~/utils/validation";
import type { Employee } from "~/db/types";
import EmployeeForm from "~/components/EmployeeForm";
import { parseFormData } from "~/utils/formParser";
import { saveFile, saveFiles } from "~/utils/fileHandler";

export const loader = async ({ params }: { params: { employeeId: string } }) => {
  const db = await getDB();
  const employee = await db.get<Employee>(
    'SELECT * FROM employees WHERE id = ?',
    params.employeeId
  );
  
  if (!employee) throw new Response("Employee not found", { status: 404 });
  
  return { employee };
};

export const action = async ({ request, params }: { 
  request: Request;
  params: { employeeId: string };
}) => {
  try {
    const { formData, files } = await parseFormData(request);
    const validation = validateEmployee(formData);
    
    if (validation.errors) return validation.errors;

    const db = await getDB();
    const updates = {
      ...formData,
      salary: parseFloat(formData.salary),
      photo_path: files.photo?.[0]?.name || formData.photo_path,
      documents_path: files.documents?.map(f => f.name).join(',') || formData.documents_path
    };

    await db.run(
      `UPDATE employees SET
        full_name = ?,
        email = ?,
        phone = ?,
        date_of_birth = ?,
        job_title = ?,
        department = ?,
        salary = ?,
        start_date = ?,
        end_date = ?,
        photo_path = ?,
        documents_path = ?
       WHERE id = ?`,
      [
        updates.full_name,
        updates.email,
        updates.phone,
        updates.date_of_birth,
        updates.job_title,
        updates.department,
        updates.salary,
        updates.start_date,
        updates.end_date,
        updates.photo_path,
        updates.documents_path,
        params.employeeId
      ]
    );

    if (files.photo) await saveFile(files.photo[0], `public/uploads/employees/${params.employeeId}`);
    if (files.documents) await saveFiles(files.documents, `public/uploads/employees/${params.employeeId}/docs`);

    return redirect(`/employees/${params.employeeId}`);
  } catch (error) {
    console.error('Update failed:', error);
    return { error: 'Failed to update employee' };
  }
};

export default function EmployeeDetailPage() {
  const { employee } = useLoaderData() as { employee: Employee };
  const errors = useActionData() as { errors?: Record<string, string> };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Employee</h1>
      <EmployeeForm employee={employee} errors={errors?.errors} />
      
      <div className="mt-6">
        <a href="/employees" className="text-blue-600 hover:underline">
          ← Back to Employees
        </a>
      </div>
    </div>
  );
}

export const ErrorBoundary = () => (
  <div className="p-4 bg-red-100 text-red-700">
    Error loading employee data
  </div>
);