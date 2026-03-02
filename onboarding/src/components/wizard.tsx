'use client';

import { useWizard } from '@/lib/context';
import { STEPS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { StepIndicator } from '@/components/step-indicator';
import { Welcome } from '@/components/steps/welcome';
import { ProjectSetup } from '@/components/steps/project-setup';
import { SupabaseSetup } from '@/components/steps/supabase-setup';
import { StripeSetup } from '@/components/steps/stripe-setup';
import { BillingSetup } from '@/components/steps/billing-setup';
import { EmailSetup } from '@/components/steps/email-setup';
import { ReviewDownload } from '@/components/steps/review-download';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const stepComponents = [
  Welcome,
  ProjectSetup,
  SupabaseSetup,
  StripeSetup,
  BillingSetup,
  EmailSetup,
  ReviewDownload,
];

export function Wizard() {
  const { currentStep, nextStep, prevStep, isFirstStep, isLastStep } = useWizard();
  const StepComponent = stepComponents[currentStep];

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <StepIndicator />
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile step indicator */}
        <div className="lg:hidden border-b bg-card px-5 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{STEPS[currentStep].title}</span>
            <span className="text-muted-foreground">
              Step {currentStep + 1} of {STEPS.length}
            </span>
          </div>
          <div className="mt-2.5 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-10 lg:py-12">
            <div className="step-enter" key={currentStep}>
              <StepComponent />
            </div>
          </div>
        </main>

        {/* Bottom navigation */}
        <footer className="border-t bg-card/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4 sm:px-8">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={isFirstStep}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            {!isLastStep && (
              <Button onClick={nextStep} className="gap-2">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
