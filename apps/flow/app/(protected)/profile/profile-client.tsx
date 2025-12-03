'use client';

import { useAuthQuery, type AuthUser } from '@repo/supabase-client/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@repo/ui/card';
import { SignOutButton } from '@/components/auth/sign-out-button';

interface ProfileClientProps {
  initialUser: AuthUser;
}

export function ProfileClient({ initialUser }: ProfileClientProps) {
  const { data: user } = useAuthQuery(initialUser);

  return (
    <div className="min-h-screen bg-background px-4 py-16" role="main" aria-label="個人資料頁面">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Title Section */}
        <section aria-labelledby="profile-heading">
          <h1 id="profile-heading" className="text-4xl font-bold text-foreground">
            個人資料
          </h1>
          <p className="text-muted-foreground mt-2">管理您的帳號資訊</p>
        </section>

        {/* User Info Card */}
        <Card className="shadow-xl border-2" role="region" aria-labelledby="user-info-title">
          <CardHeader className="border-b border-border">
            <CardTitle id="user-info-title">帳號資訊</CardTitle>
            <CardDescription>您的 Google 帳號資料</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="user-email" className="text-sm font-medium text-muted-foreground">
                Email 地址
              </label>
              <p
                id="user-email"
                className="text-lg font-medium text-foreground"
                role="status"
                aria-live="polite"
              >
                {user?.email || '未提供'}
              </p>
            </div>

            {/* User ID */}
            <div className="space-y-2">
              <label htmlFor="user-id" className="text-sm font-medium text-muted-foreground">
                用戶 ID
              </label>
              <p
                id="user-id"
                className="text-sm font-mono bg-muted px-3 py-2 rounded-md border border-border break-all"
                role="status"
                aria-live="polite"
              >
                {user?.id}
              </p>
              <p className="text-xs text-muted-foreground">此 ID 用於系統識別您的帳號</p>
            </div>

            {/* Created At */}
            <div className="space-y-2">
              <label htmlFor="user-created" className="text-sm font-medium text-muted-foreground">
                註冊時間
              </label>
              <p id="user-created" className="text-foreground" role="status" aria-live="polite">
                {user?.createdAt ? new Date(user.createdAt).toLocaleString('zh-TW') : '未知'}
              </p>
            </div>

            {/* Sign Out Button */}
            <div className="pt-4 border-t border-border">
              <SignOutButton
                variant="destructive"
                className="w-full"
                aria-label="登出帳號並返回首頁"
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card className="bg-muted/50" role="region" aria-labelledby="info-title">
          <CardContent className="pt-6">
            <h2 id="info-title" className="sr-only">
              帳號資訊提示
            </h2>
            <p className="text-sm text-muted-foreground">
              💡 <strong>提示</strong>：您的個人資料來自 Google 帳號，無法在此處修改。
              如需變更，請前往 Google 帳號設定。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
