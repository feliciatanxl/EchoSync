'use client';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export default function StepIndicator({ currentStep, totalSteps = 4 }: StepIndicatorProps) {
  return (
    <div className="mr-step-dots" aria-label={`Step ${currentStep} of ${totalSteps}`}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const step = index + 1;
        const stateClass = step === currentStep ? ' active' : step < currentStep ? ' done' : '';

        return <span key={step} className={`mr-step-dot${stateClass}`} aria-hidden="true" />;
      })}
    </div>
  );
}
