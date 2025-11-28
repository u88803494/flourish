'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@repo/supabase-client/client';
import { Button } from '@repo/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@repo/ui/card';

export function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorAlertRef = useRef<HTMLDivElement>(null);

  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const errorParam = searchParams.get('error');

  // Display error from URL
  useEffect(() => {
    if (errorParam) {
      setError(
        errorParam === 'auth_callback_error' ? '登入過程發生錯誤，請重試' : '認證失敗，請重試'
      );
    }
  }, [errorParam]);

  // Focus error alert when it appears
  useEffect(() => {
    if (error && errorAlertRef.current) {
      errorAlertRef.current.focus();
    }
  }, [error]);

  async function handleGoogleSignIn() {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createBrowserClient();

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(callbackUrl)}`,
        },
      });

      if (signInError) {
        setError('無法啟動 Google 登入，請重試');
        setIsLoading(false);
      }
      // Success will auto redirect to Google, no need to handle
    } catch {
      setError('發生未知錯誤，請重試');
      setIsLoading(false);
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4 py-8"
      role="main"
      aria-label="登入頁面"
    >
      {/* Decorative gradient elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md px-6">
        <Card
          className="w-full backdrop-blur-sm bg-card/95 border border-border/50 shadow-2xl overflow-hidden"
          role="region"
          aria-labelledby="login-title"
        >
          {/* Top accent bar */}
          <div
            className="h-1 bg-gradient-to-r from-primary via-accent to-primary"
            aria-hidden="true"
          />

          <CardHeader className="space-y-4 text-center pt-10 pb-8 px-8">
            {/* Logo circle with glow effect */}
            <div className="mx-auto relative w-20 h-20" aria-hidden="true">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-75" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-primary via-primary to-accent rounded-full flex items-center justify-center text-4xl shadow-lg">
                💰
              </div>
            </div>

            <div className="space-y-2">
              <CardTitle
                id="login-title"
                className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
              >
                歡迎使用 Flow
              </CardTitle>
              <CardDescription id="login-subtitle" className="text-sm font-medium">
                您的個人財務追蹤助手
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pb-10 px-8">
            {/* Error alert with aria-live region */}
            {error && (
              <div
                ref={errorAlertRef}
                className="p-4 bg-destructive/15 border border-destructive/30 rounded-lg text-sm text-destructive font-medium animate-in fade-in"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                tabIndex={-1}
              >
                {error}
              </div>
            )}

            {/* Main Google Sign-In Button */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-14 text-base font-semibold bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-900 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200 group"
              variant="outline"
              aria-label={isLoading ? '正在啟動 Google 登入' : '使用 Google 帳號登入'}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2" aria-live="polite">
                  <span
                    className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"
                    role="status"
                    aria-label="加載中"
                  />
                  正在啟動 Google 登入...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  使用 Google 帳號登入
                </span>
              )}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3" aria-hidden="true">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-medium">或</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Info section */}
            <div className="space-y-3 pt-2">
              <p className="text-center text-xs text-muted-foreground leading-relaxed">
                通過登入，您同意我們的
                <br />
                <a
                  href="/terms"
                  className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1"
                  aria-label="服務條款"
                >
                  服務條款
                </a>
                和
                <a
                  href="/privacy"
                  className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1"
                  aria-label="隱私政策"
                >
                  隱私政策
                </a>
              </p>
              <div
                className="p-3 bg-primary/5 rounded-lg border border-primary/10"
                role="status"
                aria-live="polite"
              >
                <p className="text-xs text-muted-foreground text-center">
                  🔒 您的資料安全由 Supabase 認證保護
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
