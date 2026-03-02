import { LayoutDashboard, Settings, CreditCard } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
  disabled?: boolean;
}

export const marketingNav: NavItem[] = [
  { title: 'Pricing', href: '/pricing' },
];

export const sidebarNav: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Settings', href: '/settings', icon: Settings },
  { title: 'Billing', href: '/settings/billing', icon: CreditCard },
];
