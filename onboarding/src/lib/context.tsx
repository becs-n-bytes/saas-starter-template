'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type OnboardingConfig, defaultConfig, STEPS } from '@/lib/types';

interface WizardContextValue {
  currentStep: number;
  config: OnboardingConfig;
  updateConfig: (updates: Partial<OnboardingConfig>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  totalSteps: number;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<OnboardingConfig>(defaultConfig);

  const updateConfig = useCallback((updates: Partial<OnboardingConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, STEPS.length - 1)));
  }, []);

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        config,
        updateConfig,
        nextStep,
        prevStep,
        goToStep,
        isFirstStep: currentStep === 0,
        isLastStep: currentStep === STEPS.length - 1,
        totalSteps: STEPS.length,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizard must be used within WizardProvider');
  return ctx;
}
