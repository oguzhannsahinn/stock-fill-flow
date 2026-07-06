import { useEffect, useRef } from "react";
import { StepIndicator } from "./stepIndicator";
import type { StepConfig } from "@/features/fillFlow/types";

interface StepperProps {
  steps: StepConfig[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  locationName?: string;
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  locationName,
}: StepperProps) {
  const liveRef = useRef<HTMLParagraphElement>(null);
  const prevStepRef = useRef(currentStep);

  useEffect(() => {
    if (prevStepRef.current !== currentStep && liveRef.current) {
      const stepLabel =
        currentStep < steps.length
          ? `Adım ${currentStep + 1}: ${steps[currentStep]?.label}`
          : "Tüm adımlar tamamlandı";
      liveRef.current.textContent = `${locationName ? `${locationName} için ` : ""}${stepLabel}`;
    }
    prevStepRef.current = currentStep;
  }, [currentStep, steps, locationName]);

  const getStatus = (index: number): "pending" | "active" | "completed" => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "active";
    return "pending";
  };

  return (
    <div className="w-full">
      <p
        ref={liveRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <ol
        role="list"
        aria-label="Dolum adımları"
        className="flex items-start w-full gap-5"
      >
        {steps.map((step, index) => {
          const status = getStatus(index);
          const isCompleted = status === "completed";

          return (
            <StepIndicator
              key={step.id}
              step={step}
              stepNumber={index + 1}
              status={status}
              isLast={index === steps.length - 1}
              canNavigate={isCompleted && !!onStepClick}
              onClick={() => onStepClick?.(index)}
            />
          );
        })}
      </ol>
    </div>
  );
}
