import { z } from "zod";

// Helper functions for validation
const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 5 || day === 6; // Friday or Saturday
};

const calculateAge = (birthDate: Date) => {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    return age - 1;
  }

  return age;
};

// Step 1: Personal Info Schema
export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .refine(
      (name) => name.trim().split(" ").length >= 2,
      "Full name must have at least 2 words"
    ),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(9, "Phone number is required"),
  dateOfBirth: z
    .date()
    .refine(
      (date) => calculateAge(date) >= 18,
      "Must be at least 18 years old"
    ),
  profilePicture: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      if (!file) return true;
      return file.size <= 2 * 1024 * 1024; // 2MB
    }, "Profile picture must be less than 2MB")
    .refine((file) => {
      if (!file) return true;
      return ["image/jpeg", "image/png"].includes(file.type);
    }, "Profile picture must be JPG or PNG"),
});

// Step 2: Job Details Schema
export const jobDetailsSchema = z
  .object({
    department: z.enum(["Engineering", "Marketing", "Sales", "HR", "Finance"]),
    positionTitle: z
      .string()
      .min(3, "Position title must be at least 3 characters"),
    startDate: z.date().refine((date) => {
      const today = new Date();
      const maxDate = new Date();
      maxDate.setDate(today.getDate() + 90);
      return date >= today && date <= maxDate;
    }, "Start date must be between today and 90 days in the future"),
    jobType: z.enum(["Full-time", "Part-time", "Contract"]),
    salaryExpectation: z.number().min(1, "Salary expectation is required"),
    managerId: z.string().min(1, "Manager selection is required"),
  })
  .superRefine((data, ctx) => {
    // Validate salary range based on job type
    if (data.jobType === "Full-time" || data.jobType === "Part-time") {
      if (data.salaryExpectation < 30000 || data.salaryExpectation > 200000) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Annual salary must be between $30,000 and $200,000",
          path: ["salaryExpectation"],
        });
      }
    } else if (data.jobType === "Contract") {
      if (data.salaryExpectation < 50 || data.salaryExpectation > 150) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Hourly rate must be between $50 and $150",
          path: ["salaryExpectation"],
        });
      }
    }

    // Validate start date for HR and Finance (no weekends)
    if (
      (data.department === "HR" || data.department === "Finance") &&
      isWeekend(data.startDate)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "HR and Finance employees cannot start on weekends",
        path: ["startDate"],
      });
    }
  });

// Step 3: Skills Schema
export const skillsSchema = z
  .object({
    primarySkills: z
      .array(z.string())
      .min(3, "Please select at least 3 skills"),
    skillExperience: z.record(z.string(), z.number().min(0).max(20)),
    workingHoursStart: z.string().min(1, "Start time is required"),
    workingHoursEnd: z.string().min(1, "End time is required"),
    remoteWorkPreference: z.number().min(0).max(100),
    managerApproved: z.boolean().optional(),
    extraNotes: z
      .string()
      .max(500, "Extra notes must be less than 500 characters")
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Validate working hours
    if (data.workingHoursStart >= data.workingHoursEnd) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End time must be after start time",
        path: ["workingHoursEnd"],
      });
    }
  });

// Step 4: Emergency Contact Schema
export const emergencyContactSchema = z
  .object({
    contactName: z.string().min(1, "Contact name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    contactPhone: z.string().min(9, "Phone number is required"),
    guardianName: z.string().optional(),
    guardianPhone: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Guardian contact validation will be handled in the form component based on age
  });

// Step 5: Review Schema
export const reviewSchema = z.object({
  confirmationChecked: z
    .boolean()
    .refine(
      (val) => val === true,
      "You must confirm all information is correct"
    ),
});

// Complete form schema
export const completeFormSchema = z.object({
  personalInfo: personalInfoSchema,
  jobDetails: jobDetailsSchema,
  skills: skillsSchema,
  emergencyContact: emergencyContactSchema,
  review: reviewSchema,
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type JobDetails = z.infer<typeof jobDetailsSchema>;
export type Skills = z.infer<typeof skillsSchema>;
export type EmergencyContact = z.infer<typeof emergencyContactSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type CompleteForm = z.infer<typeof completeFormSchema>;
