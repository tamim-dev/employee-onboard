"use client";
import { useSearchParams } from "next/navigation";

export default function EmployeeInfoPage() {
  const searchParams = useSearchParams();
  const data = searchParams.get("data");

  if (!data) return <p>No employee data found.</p>;

  const employeeData = JSON.parse(decodeURIComponent(data));

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-success">Employee Information</h1>

      <section className="border border-accent p-4 rounded text-white">
        <h2 className="text-xl font-semibold">Personal Info</h2>
        <p>
          <strong>Name:</strong> {employeeData.personalInfo.fullName}
        </p>
        <p>
          <strong>Email:</strong> {employeeData.personalInfo.email}
        </p>
        <p>
          <strong>Phone:</strong> {employeeData.personalInfo.phoneNumber}
        </p>
        <p>
          <strong>DOB:</strong> {employeeData.personalInfo.dateOfBirth}
        </p>
      </section>

      <section className="border border-accent p-4 rounded text-white">
        <h2 className="text-xl font-semibold">Job Details</h2>
        <p>
          <strong>Title:</strong> {employeeData.jobDetails.positionTitle}
        </p>
        <p>
          <strong>Department:</strong> {employeeData.jobDetails.department}
        </p>
        <p>
          <strong>Manager ID:</strong> {employeeData.jobDetails.managerId}
        </p>
        <p>
          <strong>Job Type:</strong> {employeeData.jobDetails.jobType}
        </p>
        <p>
          <strong>Start Date:</strong> {employeeData.jobDetails.startDate}
        </p>
        <p>
          <strong>Salary Expectation:</strong>{" "}
          {employeeData.jobDetails.salaryExpectation}
        </p>
      </section>

      <section className="border border-accent p-4 rounded text-white">
        <h2 className="text-xl font-semibold">Skills</h2>
        <p>
          <strong>Primary Skills:</strong>{" "}
          {employeeData.skills.primarySkills.join(", ")}
        </p>
        <p>
          <strong>Experience:</strong>
        </p>
        <ul>
          {Object.entries(employeeData.skills.skillExperience).map(
            ([skill, years]) => (
              <li key={skill}>
                {skill}: {String(years)} years
              </li>
            )
          )}
        </ul>
        <p>
          <strong>Notes:</strong> {employeeData.skills.extraNotes}
        </p>
      </section>

      <section className="border border-accent p-4 rounded text-white">
        <h2 className="text-xl font-semibold">Emergency Contact</h2>
        <p>
          <strong>Contact Name:</strong>{" "}
          {employeeData.emergencyContact.contactName}
        </p>
        <p>
          <strong>Relationship:</strong>{" "}
          {employeeData.emergencyContact.relationship}
        </p>
        <p>
          <strong>Phone:</strong> {employeeData.emergencyContact.contactPhone}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          {employeeData.emergencyContact.contactEmail || "N/A"}
        </p>
      </section>
    </div>
  );
}
