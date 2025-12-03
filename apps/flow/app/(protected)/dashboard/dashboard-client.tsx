'use client';

import { useAuthQuery, type AuthUser } from '@repo/supabase-client/auth';
import { DashboardNavbar } from './components/dashboard-navbar';
import { UserInfoCard } from './components/user-info-card';

interface DashboardClientProps {
  initialUser: AuthUser;
}

export function DashboardClient({ initialUser }: DashboardClientProps) {
  const { data: user = initialUser } = useAuthQuery(initialUser);

  return (
    <div className="min-h-screen bg-white" role="main" aria-label="Dashboard 頁面">
      <DashboardNavbar user={user} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Welcome Section */}
        <section className="mb-8" aria-labelledby="welcome-heading">
          <h1
            id="welcome-heading"
            className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-2"
          >
            歡迎回來，{user?.email?.split('@')[0]}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            「當金錢流動、統計上揚，一切都將欣欣向榮。」
          </p>
        </section>

        {/* User Info Card */}
        <UserInfoCard user={user} />
      </main>
    </div>
  );
}
