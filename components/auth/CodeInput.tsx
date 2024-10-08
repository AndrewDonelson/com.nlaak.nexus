import React from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function CodeInput({ length = 8 }: { length?: number }) {
  return (
    <div className="mb-4 transition-all duration-300 ease-in-out">
      <InputOTP
        maxLength={8}
        name="code"
        id="code"
        className="w-full"
      >
        <InputOTPGroup>
          {Array(length)
            .fill(null)
            .map((_, index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className={`
                  w-10 h-12
                  text-lg
                  border-2 border-primary
                  rounded-md
                  shadow-md
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  transition-all duration-300 ease-in-out
                  hover:shadow-lg
                  animate-fade-in
                  bg-background text-foreground
                `}
              />
            ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}