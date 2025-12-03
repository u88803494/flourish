'use client';

import type { AuthUser } from '@repo/supabase-client/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/card';

interface UserInfoCardProps {
  user: AuthUser | null;
}

export function UserInfoCard({ user }: UserInfoCardProps) {
  return (
    <Card
      className="border border-slate-200 rounded-lg shadow-sm"
      role="region"
      aria-labelledby="user-info-title"
    >
      <CardHeader className="border-b border-slate-200">
        <CardTitle id="user-info-title" className="text-xl font-semibold text-slate-900">
          帳號資訊
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="user-email" className="text-sm font-medium text-slate-600">
            電子郵件
          </label>
          <p id="user-email" className="text-base text-slate-900" role="status" aria-live="polite">
            {user?.email || '未提供'}
          </p>
        </div>

        {/* Created At */}
        <div className="space-y-2">
          <label htmlFor="user-created" className="text-sm font-medium text-slate-600">
            註冊時間
          </label>
          <p
            id="user-created"
            className="text-base text-slate-900"
            role="status"
            aria-live="polite"
          >
            {user?.createdAt ? new Date(user.createdAt).toLocaleString('zh-TW') : '未知'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
