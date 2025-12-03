'use client';

import type { AuthUser } from '@repo/supabase-client/auth';
import { SignOutButton } from '@/components/auth/sign-out-button';

interface DashboardNavbarProps {
  user: AuthUser | null;
}

export function DashboardNavbar({ user }: DashboardNavbarProps) {
  return (
    <nav
      className="bg-white border-b border-slate-200"
      role="navigation"
      aria-label="Dashboard 導航"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo + App Name */}
        <div className="flex items-center gap-3">
          {/* Flow Logo SVG */}
          <svg
            className="w-8 h-8 text-slate-900"
            viewBox="0 0 40 40"
            fill="none"
            aria-hidden="true"
          >
            {/* Three ascending bars - Financial Growth */}
            <rect x="4" y="24" width="8" height="12" rx="1" className="fill-blue-500" />
            <rect x="16" y="16" width="8" height="20" rx="1" className="fill-cyan-500" />
            <rect x="28" y="8" width="8" height="28" rx="1" className="fill-blue-500" />
            {/* Trend line with data points */}
            <path d="M8 20L20 12L32 4" stroke="currentColor" strokeWidth="2" />
            <circle cx="8" cy="20" r="2" className="fill-slate-900" />
            <circle cx="20" cy="12" r="2" className="fill-slate-900" />
            <circle cx="32" cy="4" r="2" className="fill-slate-900" />
          </svg>
          <span className="font-semibold text-slate-900">Flow</span>
        </div>

        {/* User Email + Logout */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600" role="status" aria-live="polite">
            {user?.email}
          </span>
          <SignOutButton variant="outline" aria-label="登出帳號" />
        </div>
      </div>
    </nav>
  );
}
