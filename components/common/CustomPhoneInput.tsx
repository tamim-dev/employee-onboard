import PhoneInput, { PhoneInputProps } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { cn } from "@/helpers/utils";

interface IProps extends PhoneInputProps {
  customInputClass?: string;
  customButtonClass?: string;
  customDropdownClass?: string;
  handleChange: (value: string) => void;
}

const CustomPhoneInput = ({
  customInputClass = "",
  customButtonClass = "",
  customDropdownClass = "",
  value,
  country = "us",
  countryCodeEditable = false,
  handleChange,
  ...rest
}: IProps) => {
  return (
    <PhoneInput
      enableSearch
      containerClass="bg-background"
      inputClass={cn(
        "!w-full !border !bg-transparent !border-outline/50",
        customInputClass
      )}
      buttonClass={cn(
        "!bg-transparent hover:!bg-black !border-none !text-black",
        customButtonClass
      )}
      dropdownClass={cn(
        "!text-white !bg-[#344256] !overflow-y-auto" +
          "[&_li]:!px-3 [&_li]:!py-2 [&_li]:!bg-background [&_li:hover]:!bg-[#2a2e35] [&_li]:!cursor-pointer",
        customDropdownClass
      )}
      country={country}
      value={value}
      onChange={(val) => handleChange(val)}
      countryCodeEditable={countryCodeEditable}
      {...rest}
    />
  );
};

export default CustomPhoneInput;
