import { Form, redirect } from "react-router";
import { getDB } from "~/db/getDB";
import EmployeeForm from "~/components/EmployeeForm";
import { parseFormData } from "~/utils/formParser";
import { validateEmployee } from "~/utils/validation";

export const action: ActionFunction = async ({ request }) => {
  const { formData, files } = await parseFormData(request);
  const validation = validateEmployee(formData);
  
  if (validation.errors) {
    return validation.errors;
  }

  const db = await getDB();
  const { lastID } = await db.run(
    `INSERT INTO employees (
      full_name, email, phone, date_of_birth, 
      job_title, department, salary, start_date,
      photo_path, documents_path
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      formData?.full_name,
      formData?.email,
      formData?.phone,
      formData?.date_of_birth,
      formData?.job_title,
      formData?.department,
      formData?.salary,
      formData?.start_date,
      files?.photo?.[0]?.name || null,
      files?.documents?.map(f => f.name).join(',') || null
    ]
  );

  // Save files to public/uploads
  if (files.photo) {
    await saveFile(files.photo[0], `public/uploads/employees/${lastID}`);
  }
  if (files.documents) {
    await saveFiles(files.documents, `public/uploads/employees/${lastID}/docs`);
  }

  return redirect(`/employees/${lastID}`);
};

export default function NewEmployeePage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">New Employee</h1>
      <EmployeeForm />
    </div>
  );
}