'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@repo/supabase-client/client';

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
          queryParams: {
            redirect_to: `${window.location.origin}/auth/callback?next=${encodeURIComponent(callbackUrl)}`,
          },
          skipBrowserRedirect: true,
        },
      });

      if (signInError) {
        setError('無法啟動 Google 登入，請重試');
        setIsLoading(false);
      }
      // Note: With skipBrowserRedirect, user will need to handle the response manually if needed
      // For now, the default redirect should work via popup flow
    } catch {
      setError('發生未知錯誤，請重試');
      setIsLoading(false);
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-white px-4 py-8"
      role="main"
      aria-label="登入頁面"
    >
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm">
          {/* Logo & Branding */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="flex justify-center mb-4">
              {/* FlowLogo SVG - Bar Chart + Trend Line */}
              <svg
                className="w-12 h-12 sm:w-14 sm:h-14 text-slate-900"
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
            </div>
            <h1
              id="login-heading"
              className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2"
            >
              Flow
            </h1>
            <p className="text-slate-500 text-sm sm:text-base">您的個人財務追蹤助手</p>
          </div>

          {/* Tagline */}
          <p className="text-center text-slate-600 text-sm sm:text-base mb-8 sm:mb-10 leading-relaxed text-balance">
            「當金錢流動、統計上揚，一切都將欣欣向榮。」
          </p>

          {/* Error Message */}
          {error && (
            <div
              ref={errorAlertRef}
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm text-center"
              tabIndex={-1}
            >
              {error}
            </div>
          )}

          {/* Google Login Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            aria-label={isLoading ? '正在啟動 Google 登入' : '使用 Google 帳號登入'}
            aria-busy={isLoading}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium text-base transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>登入中...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
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
                <span>使用 Google 帳號登入</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs text-slate-400 uppercase tracking-wide">
                安全登入
              </span>
            </div>
          </div>

          {/* Security Message */}
          <div className="flex items-center justify-center gap-2 text-slate-500 text-xs sm:text-sm mb-6">
            <svg
              className="w-4 h-4 text-cyan-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span>採用 Supabase 驗證，資料安全有保障</span>
          </div>

          {/* Terms & Privacy */}
          <p className="text-center text-slate-400 text-xs leading-relaxed">
            登入即表示您同意我們的
            <a
              href="/terms"
              className="text-blue-500 hover:text-blue-600 underline underline-offset-2 mx-1"
              aria-label="閱讀服務條款"
            >
              服務條款
            </a>
            及
            <a
              href="/privacy"
              className="text-blue-500 hover:text-blue-600 underline underline-offset-2 ml-1"
              aria-label="閱讀隱私政策"
            >
              隱私政策
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
