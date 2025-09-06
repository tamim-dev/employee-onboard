import { UseFormReturn } from "react-hook-form";
import { EmergencyContact } from "@/helpers/formSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/Form";
import { Input } from "@/components/common/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/Select";
import { relationships } from "@/helpers/mockData";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/common/Alert";
import CustomPhoneInput from "@/components/common/CustomPhoneInput";

interface EmergencyContactStepProps {
  form: UseFormReturn<EmergencyContact>;
  isUnder21: boolean;
}

export default function EmergencyContactStep({
  form,
  isUnder21,
}: EmergencyContactStepProps) {
  return (
    <Form {...form}>
      <div className="space-y-6">
        {isUnder21 && (
          <Alert className="border-warning bg-warning/10">
            <AlertCircle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-white">
              Since you are under 21, we also need guardian contact information.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-foreground">
            Primary Emergency Contact
          </h3>

          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter emergency contact name"
                    {...field}
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {relationships.map((relationship) => (
                        <SelectItem key={relationship} value={relationship}>
                          {relationship}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <CustomPhoneInput
                      inputProps={{
                        id: "phoneNumber",
                        maxLength: 17,
                      }}
                      handleChange={field.onChange}
                      placeholder="+1-123-456-7890"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {isUnder21 && (
          <div className="space-y-6 pt-6 border-t border-form-border">
            <h3 className="text-lg font-semibold text-foreground">
              Guardian Contact
            </h3>

            <FormField
              control={form.control}
              name="guardianName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guardian Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter guardian name"
                      {...field}
                      className="bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guardianPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guardian Phone Number</FormLabel>
                  <FormControl>
                    <CustomPhoneInput
                      inputProps={{
                        id: "phoneNumber",
                        maxLength: 17,
                      }}
                      handleChange={field.onChange}
                      placeholder="+1-123-456-7890"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="bg-muted/20 rounded-lg p-4 mt-6">
          <p className="text-sm text-muted-foreground">
            <strong>Privacy Note:</strong> This information will only be used in
            case of emergencies and will be kept confidential according to our
            privacy policy.
          </p>
        </div>
      </div>
    </Form>
  );
}
