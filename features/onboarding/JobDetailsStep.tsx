import { UseFormReturn } from "react-hook-form";
import { JobDetails } from "@/helpers/formSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/Form";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/Select";
import { RadioGroup, RadioGroupItem } from "@/components/common/RadioGroup";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/common/Popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/helpers/utils";
import { mockManagers } from "@/helpers/mockData";
import { useMemo } from "react";
import { SingleCalendar } from "@/components/common/Calendar";

interface JobDetailsStepProps {
  form: UseFormReturn<JobDetails>;
}

export default function JobDetailsStep({ form }: JobDetailsStepProps) {
  const selectedDepartment = form.watch("department");
  const jobType = form.watch("jobType");

  const availableManagers = useMemo(() => {
    if (!selectedDepartment) return [];
    return mockManagers.filter(
      (manager) => manager.department === selectedDepartment
    );
  }, [selectedDepartment]);

  const getSalaryLabel = () => {
    if (jobType === "Contract") {
      return "Hourly Rate ($50 - $150) *";
    }
    return "Annual Salary ($30,000 - $200,000) *";
  };

  const getSalaryPlaceholder = () => {
    if (jobType === "Contract") {
      return "Enter hourly rate (e.g., 75)";
    }
    return "Enter annual salary (e.g., 75000)";
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="positionTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position Title *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your position title"
                    {...field}
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal bg-background",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick your start date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <SingleCalendar
                    selected={field.value}
                    onSelect={field.onChange}
                    endMonth={new Date(2030, 12)}
                    startMonth={new Date(2024, 12)}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Job Type *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Full-time" id="full-time" />
                    <label
                      htmlFor="full-time"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Full-time
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Part-time" id="part-time" />
                    <label
                      htmlFor="part-time"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Part-time
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Contract" id="contract" />
                    <label
                      htmlFor="contract"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Contract
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="salaryExpectation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{getSalaryLabel()}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={getSalaryPlaceholder()}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="bg-background"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="managerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manager *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!selectedDepartment}
              >
                <FormControl>
                  <SelectTrigger className="bg-background">
                    <SelectValue
                      placeholder={
                        selectedDepartment
                          ? "Select your manager"
                          : "Select department first"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableManagers.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id}>
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
}
