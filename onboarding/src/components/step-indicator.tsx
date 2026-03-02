'use client';

import { useWizard } from '@/lib/context';
import { STEPS } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Check, Sparkles } from 'lucide-react';

export function StepIndicator() {
  const { currentStep, goToStep } = useWizard();

  return (
    <div className="flex h-full w-72 flex-col border-r bg-card/50">
      {/* Logo / Title */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold tracking-tight">Setup Wizard</h2>
            <p className="text-xs text-muted-foreground">Configure your starter</p>
          </div>
        </div>
      </div>

      <div className="mx-6 mb-2">
        <div className="h-px bg-border" />
      </div>

      {/* Steps */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-1">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <li key={step.id}>
                <button
                  onClick={() => goToStep(index)}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200',
                    isCurrent && 'bg-primary/10',
                    !isCurrent && 'hover:bg-muted/60'
                  )}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {isCompleted ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </div>
                    ) : isCurrent ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-xs font-bold text-primary">
                        {index + 1}
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted-foreground/25 text-xs font-medium text-muted-foreground">
                        {index + 1}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p
                      className={cn(
                        'text-sm font-medium truncate',
                        isCurrent && 'text-primary',
                        isCompleted && 'text-foreground',
                        !isCurrent && !isCompleted && 'text-muted-foreground'
                      )}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{step.description}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Progress footer */}
      <div className="border-t p-4">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>
            {currentStep + 1} / {STEPS.length}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
