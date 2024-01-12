import { VscEye, VscEyeClosed } from "react-icons/vsc";
import LoadingSpinner from "./LoadingSpinner";
import { useState } from "react";
import { Controller } from "react-hook-form";

type inputProps = {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  errors: any;
  control: any;
  defaultValue?: any;
  onChange?: () => void;
  handleDisplayPassword?: () => void;
  handleDisplayConfirmedPassword?: () => void;
};

const Input: React.FC<inputProps> = ({
  id,
  label,
  type = "text",
  disabled,
  required,
  errors,
  control,
  defaultValue = "",
  onChange,
  handleDisplayPassword,
  handleDisplayConfirmedPassword,
}) => {
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  return (
    <div className="mt-4 flex flex-col">
      <label
        className={`
          text-md 
          ${errors[id] ? "text-rose-500" : "text-gray-700"}
        `}
      >
        {label}
      </label>
      <div className="relative mt-2 flex items-center">
        <Controller
          name={id}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type={type}
              disabled={disabled}
              placeholder={`Enter your ${label}`}
              onChange={async (e) => {
                field.onChange(e);
                if (onChange) {
                  setIsLoading(true);
                  onChange();
                  setIsLoading(false);
                }
              }}
              className={`
                w-full rounded border p-2 ${
                  id.includes("password") ? "flex-1 pr-10" : ""
                } text-sm text-gray-900  focus:outline-none focus:ring-0        
                ${errors[id] ? "border-rose-500" : "border-gray-300"}
                ${
                  errors[id] ? "focus:border-rose-500" : "focus:border-gray-300"
                }
              `}
            />
          )}
        />
        {id.includes("password") && (
          <button
            type="button"
            onClick={() => {
              if (id === "password") {
                handleDisplayPassword?.();
              } else {
                handleDisplayConfirmedPassword?.();
              }
            }}
            className="absolute right-2 flex items-center justify-center bg-transparent text-gray-700"
          >
            {type === "text" ? <VscEye /> : <VscEyeClosed />}
          </button>
        )}
        {isLoading && (
          <div className="absolute right-2 flex items-center justify-center text-gray-700">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
