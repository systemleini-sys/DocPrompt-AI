"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", id, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#333]">
            {label}
          </label>
        )}
        <div
          className={`
            flex items-center h-11 rounded-xl border bg-white transition-colors duration-150
            ${error ? "border-red-500" : focused ? "border-[#165DFF]" : "border-[#E5E5E5]"}
            ${className}
          `}
        >
          {icon && <span className="pl-3 text-[#999]">{icon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={`
              flex-1 bg-transparent outline-none text-sm text-[#111] placeholder:text-[#999]
              ${icon ? "pl-2" : "pl-4"} pr-4
            `}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
