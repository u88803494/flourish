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
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Title */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">個人資料</h1>
          <p className="text-muted-foreground mt-2">管理您的帳號資訊</p>
        </div>

        {/* User Info Card */}
        <Card className="shadow-xl border-2">
          <CardHeader className="border-b border-border">
            <CardTitle>帳號資訊</CardTitle>
            <CardDescription>您的 Google 帳號資料</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email 地址</label>
              <p className="text-lg font-medium text-foreground">{user?.email || '未提供'}</p>
            </div>

            {/* User ID */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">用戶 ID</label>
              <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md border border-border">
                {user?.id}
              </p>
            </div>

            {/* Created At */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">註冊時間</label>
              <p className="text-foreground">
                {user?.createdAt ? new Date(user.createdAt).toLocaleString('zh-TW') : '未知'}
              </p>
            </div>

            {/* Sign Out Button */}
            <div className="pt-4 border-t border-border">
              <SignOutButton variant="destructive" className="w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
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
