import { UseFormReturn } from "react-hook-form";
import { Review, CompleteForm } from "@/helpers/formSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/common/Form";
import { Checkbox } from "@/components/common/Checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { format } from "date-fns";
import { mockManagers } from "@/helpers/mockData";
import {
  CheckCircle2,
  User,
  Briefcase,
  Settings,
  Phone,
  FileCheck,
} from "lucide-react";

interface ReviewStepProps {
  form: UseFormReturn<Review>;
  formData: Omit<CompleteForm, "review">;
  onSubmit: () => void;
}

export default function ReviewStep({ form, formData }: ReviewStepProps) {
  const { personalInfo, jobDetails, skills, emergencyContact } = formData;

  // Ensure skillExperience is typed for string keys
  type SkillExperienceType = Record<string, number | undefined>;
  const skillExperience: SkillExperienceType =
    (skills.skillExperience as SkillExperienceType) || {};

  const getManagerName = (managerId: string) => {
    const manager = mockManagers.find((m) => m.id === managerId);
    return manager?.name || "Unknown";
  };

  const formatSalary = (amount: number, jobType: string) => {
    if (jobType === "Contract") {
      return `$${amount}/hour`;
    }
    return `$${amount.toLocaleString()}/year`;
  };

  const calculateAge = (dateOfBirth: Date) => {
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          Review Your Information
        </h3>
        <p className="text-muted-foreground">
          Please review all the information below before submitting your
          application.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <User className="w-5 h-5 text-primary mr-2" />
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Full Name
                </p>
                <p className="text-foreground">
                  {personalInfo.fullName || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-foreground">
                  {personalInfo.email || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Phone Number
                </p>
                <p className="text-foreground">
                  {personalInfo.phoneNumber || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Date of Birth
                </p>
                <p className="text-foreground">
                  {personalInfo.dateOfBirth
                    ? `${format(
                        personalInfo.dateOfBirth,
                        "PPP"
                      )} (Age: ${calculateAge(personalInfo.dateOfBirth)})`
                    : "Not provided"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Details */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Briefcase className="w-5 h-5 text-primary mr-2" />
            <CardTitle className="text-lg">Job Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Department
                </p>
                <Badge variant="secondary">
                  {jobDetails.department || "Not selected"}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Position Title
                </p>
                <p className="text-foreground">
                  {jobDetails.positionTitle || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Job Type
                </p>
                <Badge variant="outline">
                  {jobDetails.jobType || "Not selected"}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Start Date
                </p>
                <p className="text-foreground">
                  {jobDetails.startDate
                    ? format(jobDetails.startDate, "PPP")
                    : "Not selected"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Salary Expectation
                </p>
                <p className="text-foreground font-semibold">
                  {jobDetails.salaryExpectation
                    ? formatSalary(
                        jobDetails.salaryExpectation,
                        jobDetails.jobType || ""
                      )
                    : "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Manager
                </p>
                <p className="text-foreground">
                  {jobDetails.managerId
                    ? getManagerName(jobDetails.managerId)
                    : "Not assigned"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills & Preferences */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Settings className="w-5 h-5 text-primary mr-2" />
            <CardTitle className="text-lg">Skills & Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              {skills.primarySkills?.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                  {skillExperience[skill] && (
                    <span className="ml-1 text-xs">
                      ({skillExperience[skill]} yr
                      {skillExperience[skill] !== 1 ? "s" : ""})
                    </span>
                  )}
                </Badge>
              )) || (
                <span className="text-muted-foreground">
                  No skills selected
                </span>
              )}
              <span className="text-muted-foreground">No skills selected</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Working Hours
                </p>
                <p className="text-foreground">
                  {skills.workingHoursStart && skills.workingHoursEnd
                    ? `${skills.workingHoursStart} - ${skills.workingHoursEnd}`
                    : "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Remote Work
                </p>
                <p className="text-foreground">
                  {skills.remoteWorkPreference || 0}% remote
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Manager Approval
                </p>
                <p className="text-foreground">
                  {(skills.remoteWorkPreference || 0) > 50
                    ? skills.managerApproved
                      ? "Approved"
                      : "Pending"
                    : "Not required"}
                </p>
              </div>
            </div>

            {skills.extraNotes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Additional Notes
                </p>
                <p className="text-foreground bg-muted/20 p-3 rounded-md text-sm">
                  {skills.extraNotes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Phone className="w-5 h-5 text-primary mr-2" />
            <CardTitle className="text-lg">Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Contact Name
                </p>
                <p className="text-foreground">
                  {emergencyContact.contactName || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Relationship
                </p>
                <p className="text-foreground">
                  {emergencyContact.relationship || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Phone Number
                </p>
                <p className="text-foreground">
                  {emergencyContact.contactPhone || "Not provided"}
                </p>
              </div>
            </div>

            {emergencyContact.guardianName && (
              <div className="pt-4 border-t border-form-border">
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Guardian Contact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Guardian Name
                    </p>
                    <p className="text-foreground">
                      {emergencyContact.guardianName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Guardian Phone
                    </p>
                    <p className="text-foreground">
                      {emergencyContact.guardianPhone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation */}
      <Form {...form}>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <FileCheck className="w-5 h-5 text-primary mr-2" />
            <CardTitle className="text-lg">Final Confirmation</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="confirmationChecked"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium cursor-pointer">
                      I confirm that all the information provided above is
                      accurate and complete *
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      By checking this box, you acknowledge that the information
                      is correct to the best of your knowledge.
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}
