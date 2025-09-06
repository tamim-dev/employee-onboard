import { UseFormReturn } from "react-hook-form";
import { Skills } from "@/helpers/formSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/Form";
import { Input } from "@/components/common/Input";
import { Textarea } from "@/components/common/Textarea";
import { Checkbox } from "@/components/common/Checkbox";
import { Slider } from "@/components/common/Slider";
import { skillsByDepartment } from "@/helpers/mockData";
import { useState, useEffect } from "react";

interface SkillsStepProps {
  form: UseFormReturn<Skills>;
  department?: string;
  remotePreference?: number;
}

export default function SkillsStep({
  form,
  department,
  remotePreference,
}: SkillsStepProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [experienceErrors, setExperienceErrors] = useState<string[]>([]);
  const availableSkills = department
    ? skillsByDepartment[department as keyof typeof skillsByDepartment] || []
    : [];

  const handleSkillChange = (skill: string, checked: boolean) => {
    const updatedSkills = checked
      ? [...selectedSkills, skill]
      : selectedSkills.filter((s) => s !== skill);

    setSelectedSkills(updatedSkills);
    form.setValue("primarySkills", updatedSkills);

    // Clear experience error for this skill if unchecked
    if (!checked) {
      setExperienceErrors((prev) => prev.filter((s) => s !== skill));
    }
  };

  const handleExperienceChange = (skill: string, experience: number) => {
    const currentExperience = form.getValues("skillExperience") || {};
    form.setValue("skillExperience", {
      ...currentExperience,
      [skill]: experience,
    });

    // Clear error for this skill if experience is provided
    if (experience > 0) {
      setExperienceErrors((prev) => prev.filter((s) => s !== skill));
    }
  };

  // Validate experience when skills change
  useEffect(() => {
    const currentExperience = form.getValues("skillExperience") || {};
    const skillsWithoutExperience = selectedSkills.filter((skill) => {
      const exp = currentExperience[skill];
      return !exp || exp <= 0;
    });

    setExperienceErrors(skillsWithoutExperience);
  }, [selectedSkills, form]);

  const remoteValue = form.watch("remoteWorkPreference") || 0;
  const showManagerApproval = remoteValue > 50;

  return (
    <Form {...form}>
      <div className="space-y-8">
        {/* Skills Selection */}
        <div>
          <FormLabel className="text-base font-semibold">
            Primary Skills (select at least 3) *
          </FormLabel>
          <p className="text-sm text-muted-foreground mb-4">
            Choose the skills that best represent your expertise
          </p>

          {/* Experience Alert */}
          {experienceErrors.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-red-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Missing Experience Information
                  </p>
                  <p className="text-sm text-red-700">
                    Please provide years of experience for:{" "}
                    {experienceErrors.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {availableSkills.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableSkills.map((skill) => (
                <div key={skill} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`skill-${skill}`}
                      checked={selectedSkills.includes(skill)}
                      onCheckedChange={(checked) =>
                        handleSkillChange(skill, !!checked)
                      }
                    />
                    <label
                      htmlFor={`skill-${skill}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {skill}
                    </label>
                  </div>

                  {selectedSkills.includes(skill) && (
                    <div className="ml-6 space-y-1">
                      <label className="text-xs text-muted-foreground">
                        Years of experience *
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        placeholder="Years"
                        className={`w-20 h-8 text-xs bg-background ${
                          experienceErrors.includes(skill)
                            ? "border-red-300 focus:border-red-500"
                            : ""
                        }`}
                        onChange={(e) =>
                          handleExperienceChange(skill, Number(e.target.value))
                        }
                      />
                      {experienceErrors.includes(skill) && (
                        <p className="text-xs text-red-600">Required</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Please select a department in the previous step to see available
              skills.
            </p>
          )}

          <FormField
            control={form.control}
            name="primarySkills"
            render={() => <FormMessage />}
          />
        </div>

        {/* Working Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="workingHoursStart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Start Time *</FormLabel>
                <FormControl>
                  <Input type="time" {...field} className="bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workingHoursEnd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred End Time *</FormLabel>
                <FormControl>
                  <Input type="time" {...field} className="bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Remote Work Preference */}
        <FormField
          control={form.control}
          name="remoteWorkPreference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remote Work Preference: {remoteValue}%</FormLabel>
              <FormControl>
                <div className="px-3">
                  <Slider
                    min={0}
                    max={100}
                    step={10}
                    value={[field.value || 0]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0% (Office)</span>
                    <span>50% (Hybrid)</span>
                    <span>100% (Remote)</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Manager Approval (conditional) */}
        {showManagerApproval && (
          <FormField
            control={form.control}
            name="managerApproved"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-form-border p-4 bg-muted/10">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Manager Approval Required</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Since you prefer more than 50% remote work, manager approval
                    is required.
                  </p>
                </div>
              </FormItem>
            )}
          />
        )}

        {/* Extra Notes */}
        <FormField
          control={form.control}
          name="extraNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional information about your skills, preferences, or requirements..."
                  className="bg-background min-h-[100px]"
                  maxLength={500}
                  {...field}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                {field.value?.length || 0}/500 characters
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
}
