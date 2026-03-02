'use client';

import { WizardProvider } from '@/lib/context';
import { Wizard } from '@/components/wizard';

export default function Page() {
  return (
    <WizardProvider>
      <Wizard />
    </WizardProvider>
  );
}
