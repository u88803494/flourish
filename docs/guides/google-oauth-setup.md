# Google OAuth 設定指南

## 概述

Flow 應用使用 Google Identity Services (GIS) 實現 popup 型 OAuth 2.0 認證流程。本指南說明如何配置 Google Cloud Console 和 Supabase 以完成 Google 登入功能。

## 架構

```
Flow App (Client)
    ↓
Google Identity Services SDK (popup)
    ↓
Google OAuth 2.0 Server
    ↓
Supabase Auth (ID token exchange)
    ↓
PostgreSQL Database
```

**認證流程**:

1. 用戶點擊「Google 登入」按鈕
2. Google Identity Services 在 popup 中打開 Google 登入畫面
3. 用戶授權 → Google 返回 ID token
4. Flow 發送 ID token 給 Supabase (`signInWithIdToken`)
5. Supabase 驗證並建立會話
6. 重定向到 dashboard

## 前置條件

- Google Cloud 帳號
- Supabase 專案（已設置）
- 本地環境配置完成

## Step 1: Google Cloud Console 配置

### 1.1 建立 OAuth 2.0 Client

1. 前往 [Google Cloud Console](https://console.cloud.google.com)
2. 選擇或建立專案
3. 啟用 **Google Identity Services API**
   - 搜尋「Google Identity Services API」
   - 點擊「啟用」
4. 前往 **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. 應用類型選擇 **Web application**
6. 設定名稱（例如「Flow OAuth Client」）

### 1.2 配置授權的 Origins 和 Redirect URIs

在 OAuth 2.0 Client 設定中：

**Authorized JavaScript origins** (用於 Google Sign-In 按鈕):

```
http://localhost:3100
http://192.168.68.68:3100
https://flourish-flow.vercel.app
```

**Authorized redirect URIs** (用於 OAuth 流程):

```
https://fstcioczrehqtcbdzuij.supabase.co/auth/v1/callback
```

### 1.3 複製 Client ID 和 Secret

OAuth 2.0 Client 建立後，複製：

- **Client ID**: `358393471134-621jn3ad7hm5eqhipgktqkki0m7ores2.apps.googleusercontent.com`
- **Client Secret**: 在 Supabase Dashboard 中使用

## Step 2: Supabase 配置

### 2.1 啟用 Google Provider

1. 前往 Supabase Dashboard → **Authentication** → **Providers**
2. 找到 **Google** provider
3. 點擊「Enable」
4. 輸入：
   - **Client ID**: 從 Google Cloud Console 複製
   - **Client Secret**: 從 Google Cloud Console 複製
5. 點擊「Save」

### 2.2 驗證 Callback URL

確認 Callback URL 為：

```
https://fstcioczrehqtcbdzuij.supabase.co/auth/v1/callback
```

此 URL 應與 Google Cloud Console 中的 **Authorized redirect URIs** 相同。

## Step 3: 本地環境配置

### 3.1 更新 .env.local

確保 `apps/flow/.env.local` 包含：

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://fstcioczrehqtcbdzuij.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=358393471134-621jn3ad7hm5eqhipgktqkki0m7ores2.apps.googleusercontent.com
```

**注意**: `.env.local` 在 `.gitignore` 中，不會提交到 git。

### 3.2 啟動開發伺服器

```bash
pnpm dev --filter=flow
```

應用將在 `http://localhost:3100` 上啟動。

## Step 4: 測試本地 Google OAuth

### 4.1 訪問登入頁面

1. 打開 `http://localhost:3100/login`
2. 確認看到 **Google 登入按鈕**

### 4.2 點擊登入按鈕

1. 點擊「登入」按鈕
2. Google popup 應該打開
3. 使用 Google 帳號登入
4. 授權後應重定向到 `/dashboard`

### 4.3 排查常見錯誤

**錯誤**: "The given origin is not allowed for the given client ID"

- **原因**: Google Cloud Console 尚未授權當前 origin
- **解決**:
  1. 前往 Google Cloud Console → OAuth 2.0 Client 設定
  2. 確保 `http://localhost:3100` 在 **Authorized JavaScript origins** 中
  3. 等待 5-10 分鐘讓變更生效

**錯誤**: Supabase 顯示「無法取得 Google 認證」

- **原因**: Client ID 不正確或 Client Secret 未正確配置
- **解決**:
  1. 驗證 Google Cloud Console 中的 Client ID 是否正確
  2. 驗證 Supabase Dashboard 中的 Client Secret 是否正確

**錯誤**: 登入後未重定向到 dashboard

- **原因**: Supabase 會話未正確建立
- **解決**:
  1. 檢查瀏覽器 DevTools → Console 中的錯誤訊息
  2. 驗證 Supabase 連線設定是否正確

## Step 5: 生產環境部署

### 5.1 Google Cloud Console 配置

1. 添加生產 origin：

   ```
   https://flourish-flow.vercel.app
   ```

2. 保持 Redirect URI 不變：

   ```
   https://fstcioczrehqtcbdzuij.supabase.co/auth/v1/callback
   ```

### 5.2 Vercel 環境變數

設置 Vercel 環境變數（與本地相同）：

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_GOOGLE_CLIENT_ID
```

### 5.3 驗證生產部署

1. 訪問 `https://flourish-flow.vercel.app/login`
2. 測試 Google 登入流程
3. 確認可成功登入並重定向

## 技術細節

### Google Identity Services (GIS) 流程

```typescript
// 1. 初始化 GIS
window.google.accounts.id.initialize({
  client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  callback: handleGoogleSignInCallback,
});

// 2. 渲染按鈕
window.google.accounts.id.renderButton(element, {
  type: 'standard',
  theme: 'outline',
  size: 'large',
  text: 'signin',
});

// 3. 處理 callback
async function handleGoogleSignInCallback(response: CredentialResponse) {
  // response.credential 是 Google ID token (JWT)

  // 4. 交換給 Supabase
  const { data } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: response.credential,
  });
}
```

### 安全考量

- **ID Token**: Google 簽署的 JWT，Supabase 驗證其真實性
- **RLS Policy**: Supabase 應用 Row-Level Security 確保用戶只能訪問自己的數據
- **HTTPS**: 生產環境必須使用 HTTPS，避免中間人攻擊
- **CORS**: Google SDK 會驗證請求 origin，防止跨域濫用

## 相關文件

- [Supabase Google Auth 文檔](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google Identity Services 文檔](https://developers.google.com/identity/gsi/web)
- [Google OAuth 2.0 規範](https://tools.ietf.org/html/rfc6749)

## 常見問題

**Q: 為什麼使用 popup 而不是 redirect?**
A: Popup 提供更好的用戶體驗，用戶留在登入頁面上，無需導航。

**Q: ID token 與 access token 有什麼區別?**
A: ID token 驗證用戶身份（用於登入），Access token 用於 API 認證。Flow 使用 ID token 通過 Supabase 進行登入。

**Q: 本地開發 origin 為什麼需要授權?**
A: Google 要求所有使用其 SDK 的 origin 都要明確授權，以防止濫用。

**Q: 如何登出?**
A: 使用 `supabase.auth.signOut()` 清除會話。

## 故障排除

### 調試 Google SDK 加載

在瀏覽器 DevTools Console 中檢查：

```javascript
// 檢查 Google SDK 是否加載
console.log(window.google);

// 手動初始化（用於測試）
window.google.accounts.id.initialize({
  client_id: 'YOUR_CLIENT_ID',
});
```

### 檢查 Supabase 連線

```typescript
const supabase = createBrowserClient();
const {
  data: { user },
} = await supabase.auth.getUser();
console.log('Current user:', user);
```

---

**最後更新**: 2025-12-01
**狀態**: Production Ready
**版本**: 1.0
