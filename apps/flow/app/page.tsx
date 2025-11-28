'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthQuery } from '@repo/supabase-client/auth';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { Button } from '@repo/ui/button';

export default function Home() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const { data: user, isLoading } = useAuthQuery(null);

  useEffect(() => {
    const checkApi = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6888';
        const response = await fetch(`${apiUrl}/health/liveness`);
        setApiStatus(response.ok ? 'connected' : 'disconnected');
      } catch {
        setApiStatus('disconnected');
      }
    };

    void checkApi();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            💰 Flow
          </h1>
          <div className="flex items-center gap-4">
            {/* API Status */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">API:</span>
              {apiStatus === 'checking' && <span className="text-muted-foreground">⏳</span>}
              {apiStatus === 'connected' && <span className="text-green-500">✅ Connected</span>}
              {apiStatus === 'disconnected' && <span className="text-red-500">❌ Offline</span>}
            </div>

            {/* Auth Buttons */}
            {isLoading ? (
              <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    個人資料
                  </Button>
                </Link>
                <SignOutButton variant="outline" />
              </div>
            ) : (
              <Link href="/login">
                <Button variant="default">登入</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              Financial Tracking Tool
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Track your income, expenses, and build wealth. Let money flow healthily and create
              abundance.
            </p>
          </div>

          {/* Coming Soon Placeholder */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-16">
            {/* Transaction Tracking */}
            <div className="group bg-card rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 sm:p-10 flex flex-col items-center justify-center min-h-[280px] border border-border hover:border-primary">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                💸
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-3 text-center">
                Transaction Tracking
              </h3>
              <p className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-full">
                Coming soon
              </p>
            </div>

            {/* Budget Management */}
            <div className="group bg-card rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 sm:p-10 flex flex-col items-center justify-center min-h-[280px] border border-border hover:border-secondary">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                📊
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-3 text-center">
                Budget Management
              </h3>
              <p className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-full">
                Coming soon
              </p>
            </div>

            {/* Wealth Analysis */}
            <div className="group bg-card rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 sm:p-10 flex flex-col items-center justify-center min-h-[280px] border border-border hover:border-accent sm:col-span-2 lg:col-span-1">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                📈
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-3 text-center">
                Wealth Analysis
              </h3>
              <p className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-full">
                Coming soon
              </p>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-20 bg-card/60 backdrop-blur-sm rounded-3xl shadow-xl border border-border p-8 sm:p-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-10 text-center">
              Upcoming Features
            </h2>
            <ul className="grid sm:grid-cols-2 gap-6 sm:gap-8">
              <li className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                <span className="text-3xl flex-shrink-0">💳</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg text-foreground">Multi-Account Support</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Track multiple bank accounts and credit cards
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                <span className="text-3xl flex-shrink-0">🏷️</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg text-foreground">Category Management</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Organize transactions by custom categories
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                <span className="text-3xl flex-shrink-0">⏱️</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg text-foreground">Recurring Transactions</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Set up automatic transactions for regular payments
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                <span className="text-3xl flex-shrink-0">📱</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg text-foreground">Mobile Responsive</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Track finances on the go with full mobile support
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-16 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border-2 border-primary/50">
            <p className="text-foreground text-lg font-medium text-center">
              🚀 Integration with Apex statistics coming soon
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
