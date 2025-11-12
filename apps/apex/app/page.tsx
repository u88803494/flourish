'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">📈 Apex</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">API:</span>
            {apiStatus === 'checking' && <span className="text-muted-foreground">⏳</span>}
            {apiStatus === 'connected' && <span className="text-green-500">✅ Connected</span>}
            {apiStatus === 'disconnected' && <span className="text-red-500">❌ Offline</span>}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">Statistics Tracking Tool</h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Visualize your performance metrics with beautiful, interactive charts. Track your
            progress and reach new peaks.
          </p>

          {/* Coming Soon Placeholder */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Chart Placeholder */}
            <div className="bg-card rounded-2xl shadow-lg p-12 flex items-center justify-center h-80 border border-border hover:border-primary/50 transition-colors">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  Interactive Charts
                </h3>
                <p className="text-muted-foreground">Coming soon</p>
              </div>
            </div>

            {/* Analytics Placeholder */}
            <div className="bg-card rounded-2xl shadow-lg p-12 flex items-center justify-center h-80 border border-border hover:border-secondary/50 transition-colors">
              <div className="text-center">
                <div className="text-6xl mb-4">📈</div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  Performance Analytics
                </h3>
                <p className="text-muted-foreground">Coming soon</p>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="bg-card rounded-2xl shadow-lg p-12 mb-12 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-8">Upcoming Features</h2>
            <ul className="grid md:grid-cols-3 gap-6 text-left">
              <li className="flex items-start gap-3 p-4 rounded-lg hover:bg-accent transition-colors">
                <span className="text-2xl">📊</span>
                <div>
                  <h4 className="font-semibold text-foreground">Real-time Charts</h4>
                  <p className="text-sm text-muted-foreground">
                    Interactive visualizations of your data
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 p-4 rounded-lg hover:bg-accent transition-colors">
                <span className="text-2xl">📈</span>
                <div>
                  <h4 className="font-semibold text-foreground">Trend Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Identify patterns and growth opportunities
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 p-4 rounded-lg hover:bg-accent transition-colors">
                <span className="text-2xl">🎯</span>
                <div>
                  <h4 className="font-semibold text-foreground">Goal Tracking</h4>
                  <p className="text-sm text-muted-foreground">
                    Monitor progress toward your targets
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="inline-block bg-primary/10 border-2 border-primary rounded-2xl px-6 py-4">
            <p className="text-primary text-lg font-medium">
              🚀 Integration with Flourish coming soon
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
