# 曲線圖工具與整合設計

## 📈 什麼是山達基的狀況公式？

### 背景

**山達基（Scientology）** 是一個宗教和哲學系統，其中包含一套管理和組織的方法論。其中一個核心概念是 **狀況公式（Condition Formulas）**，用於評估和改善個人、團隊或組織的表現。

### 核心概念

狀況公式基於「統計數據」來判斷當前的「狀況」，並提供相應的行動步驟。

#### 統計數據（Statistics）

- 任何可量化的指標（如：收入、產出、銷售量、完成的任務數等）
- 透過時間序列圖表（曲線）來追蹤趨勢
- 觀察數據的 **上升**、**下降** 或 **持平**

#### 狀況等級（Conditions）

根據統計曲線的趨勢，判定當前所處的狀況：

1. **Power（權力）**：統計持續在非常高的水平
2. **Affluence（富裕）**：統計突然大幅上升
3. **Normal Operation（正常運作）**：統計穩定上升
4. **Emergency（緊急）**：統計開始下降
5. **Danger（危險）**：統計持續下降
6. **Non-Existence（不存在）**：新開始或統計為零
7. **Liability（負債）**：統計嚴重下降且對他人造成損害
8. **Doubt（懷疑）**：不確定狀況或需要做出選擇
9. **Enemy（敵對）**：明確的破壞行為
10. **Treason（叛國）**：背叛

### 狀況公式的應用

每個狀況等級都有對應的「公式」（步驟），告訴你該做什麼來改善或維持狀況。

#### 範例：Emergency（緊急）公式

當你的統計數據開始下降時：

1. **Promote**（推廣）：立即採取行動增加產出
2. **Change operating basis**（改變運作方式）：調整策略或方法
3. **Economize**（節約）：減少不必要的開支
4. **Prepare to deliver**（準備交付）：確保能夠履行承諾
5. **Part with the past**（與過去告別）：放棄無效的舊方法

#### 範例：Affluence（富裕）公式

當統計突然大幅上升時：

1. **Economize**：不要因為成功就浪費資源
2. **Pay debts**：償還過去的債務
3. **Invest in expansion**：投資於擴展
4. **Maintain the level**：維持當前的高水平

### 在記帳應用中的應用

在個人財務管理中，可以將這套方法論應用於：

- **收入曲線**：追蹤每月收入趨勢，判斷財務狀況
- **支出曲線**：追蹤支出趨勢，識別過度消費
- **儲蓄曲線**：追蹤儲蓄率，確保財務健康
- **淨收入曲線**：收入減去支出，判斷整體財務狀況

根據曲線趨勢，自動判定當前的「財務狀況」，並提供相應的建議行動。

---

## 🛠️ 現有的 Curves Tool 專案

### 專案概覽

**位置**：`/Users/henry_lee/Developer/Personal/curves_tool`

**技術棧**：

- Next.js 14+ (App Router)
- TypeScript
- Supabase（認證 + 資料庫）
- Tailwind CSS

### 現有功能（根據 README）

1. **曲線圖繪製**：視覺化統計數據
2. **狀況判定**：根據趨勢判斷當前狀況等級
3. **數據追蹤**：記錄和管理多個統計項目
4. **趨勢分析**：分析數據趨勢（上升/下降/持平）

### 專案結構

```
curves_tool/
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/    # React 元件
│   ├── lib/           # 工具函式
│   └── types/         # TypeScript 類型
├── public/
├── package.json
└── README.md
```

---

## 🔗 與記帳應用的整合策略

### 整合目標

1. **記帳數據自動生成曲線**：
   - 收入曲線（每日/每週/每月）
   - 支出曲線
   - 淨收入曲線
   - 各分類支出曲線

2. **狀況自動判定**：
   - 根據財務趨勢自動判定財務狀況
   - 提供改善建議

3. **模組復用**：
   - 記帳應用使用曲線圖的繪製功能
   - 曲線工具可以接收記帳數據進行深度分析

### 整合方式：三層架構

#### 第一層：共享核心邏輯（`packages/chart-engine`）

建立一個獨立的 package，包含曲線圖的核心邏輯：

```
packages/chart-engine/
├── src/
│   ├── core/
│   │   ├── curve-calculator.ts      # 曲線計算
│   │   ├── trend-analyzer.ts        # 趨勢分析
│   │   ├── condition-detector.ts    # 狀況判定
│   │   └── statistics.ts            # 統計計算
│   ├── renderers/
│   │   ├── chart-renderer.ts        # 圖表渲染邏輯
│   │   └── chart-config.ts          # 圖表配置
│   ├── types/
│   │   ├── data-point.ts
│   │   ├── condition.ts
│   │   └── trend.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

**核心介面設計**：

```typescript
// packages/chart-engine/src/types/data-point.ts
export interface DataPoint {
  date: Date;
  value: number;
  label?: string;
}

export interface TimeSeries {
  id: string;
  name: string;
  data: DataPoint[];
  unit?: string; // 單位（如：元、筆）
}

// packages/chart-engine/src/types/condition.ts
export enum ConditionLevel {
  POWER = 'power',
  AFFLUENCE = 'affluence',
  NORMAL = 'normal',
  EMERGENCY = 'emergency',
  DANGER = 'danger',
  NON_EXISTENCE = 'non-existence',
  // ... 其他狀況
}

export interface ConditionResult {
  level: ConditionLevel;
  trend: 'up' | 'down' | 'flat';
  changeRate: number; // 變化率（%）
  recommendation: string[]; // 建議行動
}

// packages/chart-engine/src/types/trend.ts
export interface TrendAnalysis {
  trend: 'up' | 'down' | 'flat';
  slope: number; // 斜率
  changeRate: number; // 變化率
  average: number; // 平均值
  volatility: number; // 波動性
}
```

**核心功能實作**：

```typescript
// packages/chart-engine/src/core/trend-analyzer.ts
export class TrendAnalyzer {
  /**
   * 分析時間序列的趨勢
   */
  analyze(timeSeries: TimeSeries): TrendAnalysis {
    const data = timeSeries.data;

    // 計算平均值
    const average = this.calculateAverage(data);

    // 計算趨勢（線性回歸）
    const slope = this.calculateSlope(data);

    // 判定趨勢方向
    const trend = this.determineTrend(slope);

    // 計算變化率
    const changeRate = this.calculateChangeRate(data);

    // 計算波動性（標準差）
    const volatility = this.calculateVolatility(data, average);

    return {
      trend,
      slope,
      changeRate,
      average,
      volatility,
    };
  }

  private calculateAverage(data: DataPoint[]): number {
    const sum = data.reduce((acc, point) => acc + point.value, 0);
    return sum / data.length;
  }

  private calculateSlope(data: DataPoint[]): number {
    // 線性回歸計算斜率
    // y = mx + b，求 m
    const n = data.length;
    if (n < 2) return 0;

    const xValues = data.map((_, i) => i);
    const yValues = data.map((point) => point.value);

    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }

  private determineTrend(slope: number): 'up' | 'down' | 'flat' {
    const threshold = 0.01; // 可調整的閾值
    if (slope > threshold) return 'up';
    if (slope < -threshold) return 'down';
    return 'flat';
  }

  private calculateChangeRate(data: DataPoint[]): number {
    if (data.length < 2) return 0;

    const firstValue = data[0].value;
    const lastValue = data[data.length - 1].value;

    if (firstValue === 0) return 0;

    return ((lastValue - firstValue) / firstValue) * 100;
  }

  private calculateVolatility(data: DataPoint[], average: number): number {
    const variance =
      data.reduce((sum, point) => {
        const diff = point.value - average;
        return sum + diff * diff;
      }, 0) / data.length;

    return Math.sqrt(variance);
  }
}
```

```typescript
// packages/chart-engine/src/core/condition-detector.ts
export class ConditionDetector {
  /**
   * 根據趨勢分析判定狀況等級
   */
  detect(analysis: TrendAnalysis, previousAnalysis?: TrendAnalysis): ConditionResult {
    const { trend, changeRate } = analysis;

    let level: ConditionLevel;
    let recommendation: string[] = [];

    // 判定邏輯
    if (trend === 'up' && changeRate > 50) {
      // 突然大幅上升
      level = ConditionLevel.AFFLUENCE;
      recommendation = [
        '恭喜！財務狀況大幅改善',
        '建議：償還債務並投資於未來',
        '不要因為成功就過度消費',
        '維持當前的良好習慣',
      ];
    } else if (trend === 'up' && changeRate > 10) {
      // 穩定上升
      level = ConditionLevel.NORMAL;
      recommendation = ['財務狀況正常運作', '繼續保持當前的收支模式', '可以考慮增加儲蓄或投資'];
    } else if (trend === 'flat') {
      // 持平
      level = ConditionLevel.NORMAL;
      recommendation = ['財務狀況穩定', '考慮尋找增加收入的機會'];
    } else if (trend === 'down' && changeRate > -10) {
      // 開始下降
      level = ConditionLevel.EMERGENCY;
      recommendation = [
        '警告：財務狀況開始下降',
        '立即採取行動：減少非必要支出',
        '尋找增加收入的方法',
        '檢視並調整預算',
      ];
    } else if (trend === 'down' && changeRate <= -10) {
      // 持續下降
      level = ConditionLevel.DANGER;
      recommendation = [
        '危險：財務狀況嚴重下降',
        '緊急行動：大幅削減支出',
        '停止所有非必要消費',
        '考慮變賣資產或尋求協助',
        '制定債務償還計畫',
      ];
    } else {
      level = ConditionLevel.NON_EXISTENCE;
      recommendation = ['開始記錄你的財務數據', '設定清晰的財務目標'];
    }

    return {
      level,
      trend,
      changeRate,
      recommendation,
    };
  }

  /**
   * 取得狀況等級的顯示資訊
   */
  getConditionInfo(level: ConditionLevel) {
    const infoMap = {
      [ConditionLevel.POWER]: {
        name: '權力',
        color: 'green',
        description: '財務狀況極佳，持續維持高水平',
      },
      [ConditionLevel.AFFLUENCE]: {
        name: '富裕',
        color: 'blue',
        description: '財務狀況突然大幅改善',
      },
      [ConditionLevel.NORMAL]: {
        name: '正常',
        color: 'green',
        description: '財務狀況穩定良好',
      },
      [ConditionLevel.EMERGENCY]: {
        name: '緊急',
        color: 'yellow',
        description: '財務狀況開始惡化，需要立即行動',
      },
      [ConditionLevel.DANGER]: {
        name: '危險',
        color: 'red',
        description: '財務狀況嚴重惡化，需要緊急處理',
      },
      [ConditionLevel.NON_EXISTENCE]: {
        name: '不存在',
        color: 'gray',
        description: '尚未建立財務記錄',
      },
    };

    return infoMap[level];
  }
}
```

#### 第二層：應用層整合

**在記帳應用中使用（`apps/ledger`）**：

```typescript
// apps/ledger/src/lib/financial-analyzer.ts
import { TrendAnalyzer, ConditionDetector, TimeSeries, DataPoint } from '@workspace/chart-engine';
import { Transaction } from '@workspace/database';

export class FinancialAnalyzer {
  private trendAnalyzer = new TrendAnalyzer();
  private conditionDetector = new ConditionDetector();

  /**
   * 將交易記錄轉換為時間序列
   */
  transactionsToTimeSeries(
    transactions: Transaction[],
    type: 'income' | 'expense' | 'net',
    groupBy: 'day' | 'week' | 'month' = 'month'
  ): TimeSeries {
    // 過濾和分組
    const filtered =
      type === 'net' ? transactions : transactions.filter((t) => t.type === type.toUpperCase());

    // 按時間分組並計算總額
    const grouped = this.groupByPeriod(filtered, groupBy);

    const data: DataPoint[] = grouped.map((group) => ({
      date: group.date,
      value: group.total,
    }));

    return {
      id: type,
      name: type === 'income' ? '收入' : type === 'expense' ? '支出' : '淨收入',
      data,
      unit: '元',
    };
  }

  /**
   * 分析財務狀況
   */
  analyzeFinancialCondition(transactions: Transaction[]) {
    // 生成淨收入曲線
    const netIncomeSeries = this.transactionsToTimeSeries(transactions, 'net');

    // 分析趨勢
    const analysis = this.trendAnalyzer.analyze(netIncomeSeries);

    // 判定狀況
    const condition = this.conditionDetector.detect(analysis);

    return {
      analysis,
      condition,
      series: netIncomeSeries,
    };
  }

  private groupByPeriod(transactions: Transaction[], period: 'day' | 'week' | 'month') {
    // 實作分組邏輯
    // ...
    return [];
  }
}
```

**在曲線圖工具中使用（`apps/curves`）**：

```typescript
// apps/curves/src/lib/data-importer.ts
import { TimeSeries } from '@workspace/chart-engine';

export class DataImporter {
  /**
   * 從記帳應用匯入數據
   */
  async importFromLedger(userId: string, dateRange: DateRange): Promise<TimeSeries[]> {
    // 呼叫記帳 API 取得數據
    const response = await fetch(
      `/api/ledger/export?userId=${userId}&from=${dateRange.from}&to=${dateRange.to}`
    );
    const data = await response.json();

    // 轉換為 TimeSeries 格式
    return this.convertToTimeSeries(data);
  }

  private convertToTimeSeries(data: any): TimeSeries[] {
    // 轉換邏輯
    return [];
  }
}
```

#### 第三層：資料流整合

**選項 A：API 匯出/匯入（推薦初期使用）**

1. 記帳應用提供數據匯出 API：

```typescript
// apps/api/src/ledger/ledger.controller.ts
@Controller('ledger')
export class LedgerController {
  @Get('export')
  @UseGuards(SupabaseAuthGuard)
  async exportData(
    @User() user,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('format') format: 'json' | 'csv' = 'json'
  ) {
    const transactions = await this.ledgerService.getTransactions(
      user.id,
      new Date(from),
      new Date(to)
    );

    // 轉換為統計曲線格式
    const timeSeries = this.convertToTimeSeries(transactions);

    return {
      userId: user.id,
      dateRange: { from, to },
      timeSeries,
    };
  }
}
```

2. 曲線圖工具匯入數據：

```typescript
// 在曲線圖工具中
const importFromLedger = async () => {
  const response = await fetch(`${LEDGER_API_URL}/ledger/export?from=...&to=...`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  // 使用匯入的數據繪製曲線
};
```

**選項 B：共享資料庫（深度整合）**

1. 在 `packages/database` 定義共享的 Statistics 模型：

```prisma
model Statistic {
  id        String   @id @default(uuid())
  userId    String
  name      String
  value     Decimal
  date      DateTime
  source    String   // 'ledger', 'manual', etc.
  category  String?
  createdAt DateTime @default(now())

  @@index([userId, date])
  @@index([userId, source])
}
```

2. 記帳應用自動寫入統計數據：

```typescript
// 每次有新交易時，更新統計
await prisma.statistic.create({
  data: {
    userId: user.id,
    name: 'daily_income',
    value: transaction.amount,
    date: transaction.date,
    source: 'ledger',
    category: transaction.category?.name,
  },
});
```

3. 曲線圖工具直接讀取：

```typescript
// 從共享資料庫讀取統計數據
const stats = await prisma.statistic.findMany({
  where: {
    userId: user.id,
    source: 'ledger',
    date: { gte: from, lte: to },
  },
});
```

---

## 🎨 UI/UX 整合

### 在記帳應用中嵌入曲線圖

```typescript
// apps/ledger/src/app/dashboard/page.tsx
import { ChartRenderer } from '@workspace/chart-engine';
import { FinancialAnalyzer } from '@/lib/financial-analyzer';

export default async function Dashboard() {
  const transactions = await getTransactions();
  const analyzer = new FinancialAnalyzer();

  const { analysis, condition, series } = analyzer.analyzeFinancialCondition(transactions);

  return (
    <div>
      <h1>財務儀表板</h1>

      {/* 狀況卡片 */}
      <ConditionCard condition={condition} />

      {/* 曲線圖 */}
      <ChartRenderer data={series} />

      {/* 建議行動 */}
      <RecommendationList items={condition.recommendation} />

      {/* 進階分析連結 */}
      <Link href="/curves">
        <Button>查看進階曲線分析</Button>
      </Link>
    </div>
  );
}
```

### 從曲線圖工具跳轉回記帳

```typescript
// apps/curves/src/components/data-source-selector.tsx
export function DataSourceSelector() {
  return (
    <div>
      <h2>選擇數據來源</h2>
      <button onClick={() => importFromLedger()}>
        從記帳應用匯入
      </button>
      <button onClick={() => manualInput()}>
        手動輸入數據
      </button>
    </div>
  );
}
```

---

## 📋 實作計畫

### Phase 1：建立 chart-engine package（Sprint 4）

- [ ] 建立 `packages/chart-engine` 結構
- [ ] 實作 `TrendAnalyzer`
- [ ] 實作 `ConditionDetector`
- [ ] 定義核心型別和介面
- [ ] 撰寫單元測試
- [ ] 撰寫文檔

### Phase 2：記帳應用整合（Sprint 5）

- [ ] 實作 `FinancialAnalyzer`
- [ ] 在儀表板顯示基本曲線
- [ ] 顯示財務狀況和建議
- [ ] 實作數據匯出 API
- [ ] 測試整合

### Phase 3：曲線圖工具遷移（Sprint 6）

- [ ] 將現有 curves_tool 遷移到 monorepo
- [ ] 重構以使用 chart-engine
- [ ] 實作數據匯入功能
- [ ] 測試雙向整合

### Phase 4：進階功能（Sprint 7+）

- [ ] 多維度分析（分類、帳戶、標籤）
- [ ] 自訂統計項目
- [ ] 目標設定和追蹤
- [ ] 預測和模擬

---

## 🎯 總結

**整合策略的核心**：

1. **模組化設計**：透過 `chart-engine` package 共享核心邏輯
2. **鬆耦合**：兩個應用保持獨立，透過標準介面通訊
3. **漸進式整合**：從簡單的 API 匯出開始，逐步深化整合
4. **以使用者為中心**：在記帳應用中提供基本分析，需要深度分析時引導到曲線圖工具

**預期效果**：

- ✅ 記帳應用自動產生財務曲線和狀況分析
- ✅ 曲線圖工具可以接收記帳數據進行深度分析
- ✅ 程式碼復用，減少重複開發
- ✅ 統一的資料模型和分析邏輯
- ✅ 為未來增加更多工具奠定基礎
