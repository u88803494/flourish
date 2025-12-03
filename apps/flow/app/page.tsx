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
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-foreground">💰 Flow</div>
          <div className="flex gap-4 items-center">
            {isLoading ? (
              <div className="w-20 h-10 bg-muted animate-pulse rounded" />
            ) : user ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost">個人資料</Button>
                </Link>
                <SignOutButton variant="outline" />
              </>
            ) : (
              <Link href="/login">
                <Button>登入</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-5xl font-bold text-foreground mb-4">個人財務追蹤</h1>
        <p className="text-xl text-muted-foreground mb-8">簡單、智能、安全的財務管理工具</p>
        <div className="flex gap-4 justify-center">
          {user ? (
            <Link href="/dashboard">
              <Button size="lg">前往儀表板</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="lg">開始使用</Button>
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">核心功能</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: '交易追蹤', description: '紀錄每筆交易，分類管理' },
            { title: '智能分析', description: '自動生成支出報告和趨勢分析' },
            { title: '安全保護', description: '由 Supabase 提供企業級安全' },
          ].map((feature, idx) => (
            <div key={idx} className="p-6 bg-card border border-border rounded-lg">
              <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* API Status */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="p-4 bg-muted rounded-lg text-center text-sm text-muted-foreground">
          API 狀態:{' '}
          {apiStatus === 'connected'
            ? '✅ 連接'
            : apiStatus === 'disconnected'
              ? '❌ 未連接'
              : '⏳ 檢查中'}
        </div>
      </section>
    </div>
  );
}
