import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Sparkles className="h-6 w-6" />
      <span className="font-bold text-lg">{siteConfig.name}</span>
    </Link>
  );
}
