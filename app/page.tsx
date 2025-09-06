"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/common/Card";
import { Progress } from "@/components/common/Progress";
import { Button } from "@/components/common/Button";
import { CheckCircle2, Circle, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/helpers/utils";
import { toast } from "@/hooks/useToast";

// Import step components
import PersonalInfoStep from "@/features/onboarding/PersonalInfoStep";
import JobDetailsStep from "@/features/onboarding/JobDetailsStep";
import SkillsStep from "@/features/onboarding/SkillsStep";
import EmergencyContactStep from "@/features/onboarding/EmergencyContactStep";
import ReviewStep from "@/features/onboarding/ReviewStep";

// Import schemas
import {
  personalInfoSchema,
  jobDetailsSchema,
  skillsSchema,
  emergencyContactSchema,
  reviewSchema,
  type PersonalInfo,
  type JobDetails,
  type Skills,
  type EmergencyContact,
  type Review,
} from "@/helpers/formSchema";

const steps = [
  { id: 1, title: "Personal Info", description: "Basic information about you" },
  { id: 2, title: "Job Details", description: "Position and role information" },
  {
    id: 3,
    title: "Skills & Preferences",
    description: "Your skills and work preferences",
  },
  {
    id: 4,
    title: "Emergency Contact",
    description: "Emergency contact information",
  },
  {
    id: 5,
    title: "Review & Submit",
    description: "Review and confirm your information",
  },
];

export default function Home() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: new Date(),
      profilePicture: undefined,
    },
    jobDetails: {
      positionTitle: "",
      department: "Engineering" as const,
      managerId: "",
      jobType: "Full-time" as const,
      startDate: new Date(),
      salaryExpectation: 0,
    },
    skills: {
      primarySkills: [],
      skillExperience: {},
      experienceLevel: "",
      remoteWorkPreference: 0,
      workingHoursStart: "",
      workingHoursEnd: "",
    },
    emergencyContact: {
      contactName: "",
      relationship: "",
      contactPhone: "",
      guardianName: "",
      guardianRelationship: "",
      guardianPhone: "",
      guardianEmail: "",
    },
    review: {
      confirmationChecked: false,
    },
  });

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth?: Date) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
    ) {
      return age - 1;
    }

    return age;
  };

  const age = calculateAge(formData.personalInfo.dateOfBirth);
  const isUnder21 = age !== null && age < 21;

  // Form instances for each step
  const personalForm = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: formData.personalInfo,
  });

  const jobForm = useForm<JobDetails>({
    resolver: zodResolver(jobDetailsSchema),
    defaultValues: formData.jobDetails,
  });

  const skillsForm = useForm<Skills>({
    resolver: zodResolver(skillsSchema),
    defaultValues: formData.skills,
  });

  const emergencyForm = useForm<EmergencyContact>({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: formData.emergencyContact,
  });

  const reviewForm = useForm<Review>({
    resolver: zodResolver(reviewSchema),
    defaultValues: formData.review,
  });

  // Get current form instance
  const getCurrentForm = () => {
    switch (currentStep) {
      case 1:
        return personalForm;
      case 2:
        return jobForm;
      case 3:
        return skillsForm;
      case 4:
        return emergencyForm;
      case 5:
        return reviewForm;
      default:
        return personalForm;
    }
  };

  // Handle step navigation
  const goToStep = (step: number) => {
    if (step <= completedSteps.length + 1 && step >= 1) {
      setCurrentStep(step);
    }
  };

  const nextStep = async () => {
    const currentForm = getCurrentForm();
    const isValid = await currentForm.trigger();

    if (isValid) {
      const data = currentForm.getValues();

      // Update form data
      setFormData((prev) => ({
        ...prev,
        [getStepKey(currentStep)]: data,
      }));

      // Mark step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }

      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before proceeding.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepKey = (step: number): keyof typeof formData => {
    switch (step) {
      case 1:
        return "personalInfo";
      case 2:
        return "jobDetails";
      case 3:
        return "skills";
      case 4:
        return "emergencyContact";
      case 5:
        return "review";
      default:
        return "personalInfo";
    }
  };

  // Handle final submission
  const handleSubmit = async () => {
    toast({
      title: "Success!",
      description: "Employee onboarding completed successfully.",
    });
    router.push(
      `/employee-info?data=${encodeURIComponent(JSON.stringify(formData))}`
    );
  };

  // Render step indicator
  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex flex-col items-center flex-1">
          <div className="flex items-center w-full">
            <button
              onClick={() => goToStep(step.id)}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                currentStep === step.id
                  ? "bg-step-active border-step-active text-white"
                  : completedSteps.includes(step.id)
                  ? "bg-step-completed border-step-completed text-white"
                  : "bg-background border-step-inactive text-step-inactive"
              )}
              disabled={step.id > completedSteps.length + 1}
            >
              {completedSteps.includes(step.id) ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2",
                  completedSteps.includes(step.id)
                    ? "bg-step-completed"
                    : "bg-step-inactive"
                )}
              />
            )}
          </div>
          <div className="mt-2 text-center">
            <p
              className={cn(
                "text-sm font-medium",
                currentStep === step.id
                  ? "text-step-active"
                  : "text-muted-foreground"
              )}
            >
              {step.title}
            </p>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep form={personalForm} />;
      case 2:
        return <JobDetailsStep form={jobForm} />;
      case 3:
        return (
          <SkillsStep
            form={skillsForm}
            department={formData.jobDetails.department}
            remotePreference={skillsForm.watch("remoteWorkPreference")}
          />
        );
      case 4:
        return (
          <EmergencyContactStep form={emergencyForm} isUnder21={isUnder21} />
        );
      case 5:
        return (
          <ReviewStep
            form={reviewForm}
            formData={formData}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  // Calculate progress percentage
  const progressPercentage = (completedSteps.length / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Employee Onboarding
          </h1>
          <p className="text-muted-foreground">
            Welcome! Let&apos;s get you set up with all the information we need.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">
              Progress
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step indicator */}
        {renderStepIndicator()}

        {/* Form content */}
        <Card className="bg-form-background border-form-border shadow-card p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-muted-foreground">
              {steps[currentStep - 1].description}
            </p>
          </div>

          {renderStepContent()}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-form-border">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < 5 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                className="bg-success hover:bg-success/90"
                disabled={!reviewForm.watch("confirmationChecked")}
              >
                Submit Application
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
