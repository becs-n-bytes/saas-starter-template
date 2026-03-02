'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface UpgradePromptProps {
  title?: string;
  description?: string;
}

export function UpgradePrompt({
  title = 'Upgrade to Pro',
  description = 'Get access to all features and unlimited usage.',
}: UpgradePromptProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button size="sm" asChild>
          <Link href="/settings/billing">View Plans</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
