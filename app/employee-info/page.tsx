"use client";

import { Suspense } from "react";
import EmployeeInfoContent from "@/components/EmployeeInfoContent";

export default function EmployeeInfoPage() {
  return (
    <Suspense fallback={<p className="p-6">Loading employee info...</p>}>
      <EmployeeInfoContent />
    </Suspense>
  );
}
