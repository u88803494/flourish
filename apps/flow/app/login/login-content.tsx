'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@repo/supabase-client/client';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: CredentialResponse) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: { type: string; theme: string; size: string; text: string }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface CredentialResponse {
  credential?: string;
  clientId?: string;
}

export function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorAlertRef = useRef<HTMLDivElement>(null);
  const googleButtonRef = useRef<HTMLDivElement>(null);

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

  // Initialize Google Sign-In with popup mode
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (!window.google) {
        // Retry if Google SDK not yet loaded
        setTimeout(initializeGoogleSignIn, 100);
        return;
      }

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        callback: handleGoogleSignInCallback,
      });

      // Render Google button in popup mode
      if (googleButtonRef.current) {
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin',
        });
      }
    };

    initializeGoogleSignIn();
  }, []);

  async function handleGoogleSignInCallback(response: CredentialResponse) {
    if (!response.credential) {
      setError('無法取得 Google 認證，請重試');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createBrowserClient();

      const { data, error: signInError } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      });

      if (signInError) {
        setError('Google 登入失敗，請重試');
        setIsLoading(false);
        return;
      }

      if (data.session) {
        router.push(callbackUrl);
      }
    } catch (err) {
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

          {/* Google Sign-In Button (Popup Mode) */}
          <div
            ref={googleButtonRef}
            className="flex justify-center"
            role="button"
            aria-label="使用 Google 帳號登入"
          />

          {/* Fallback message if Google Sign-In fails to load */}
          <p className="text-center text-slate-500 text-xs mt-4">
            如果 Google 按鈕未顯示，請檢查您的網路連線或刷新頁面
          </p>

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
