# NestJS 快速參考指南

本文檔整理了 NestJS 的核心概念和常用模式，方便開發時快速查閱。

---

## 核心概念

### 1. 模組 (Modules)

模組是 NestJS 組織程式碼的基本單位。

```typescript
// transactions.module.ts
import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // 匯入其他模組
  controllers: [TransactionsController], // 註冊 controllers
  providers: [TransactionsService], // 註冊 providers (services)
  exports: [TransactionsService], // 匯出給其他模組使用
})
export class TransactionsModule {}
```

**關鍵點**:

- 每個功能一個模組
- `imports`: 需要使用的其他模組
- `controllers`: HTTP 請求處理器
- `providers`: 可注入的服務
- `exports`: 提供給其他模組的服務

---

### 2. 控制器 (Controllers)

處理 HTTP 請求並回傳響應。

```typescript
// transactions.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';

@Controller('transactions') // 路由前綴: /transactions
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  // GET /transactions
  @Get()
  @UseGuards(AuthGuard)
  async findAll(@User() user: UserPayload, @Query() query: PaginationDto) {
    return this.transactionsService.findAll(user.id, query);
  }

  // GET /transactions/:id
  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string, @User() user: UserPayload) {
    return this.transactionsService.findOne(id, user.id);
  }

  // POST /transactions
  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() dto: CreateTransactionDto, @User() user: UserPayload) {
    return this.transactionsService.create(dto, user.id);
  }

  // PATCH /transactions/:id
  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
    @User() user: UserPayload
  ) {
    return this.transactionsService.update(id, dto, user.id);
  }

  // DELETE /transactions/:id
  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string, @User() user: UserPayload) {
    return this.transactionsService.remove(id, user.id);
  }
}
```

**常用裝飾器**:

- `@Controller(prefix)`: 定義控制器和路由前綴
- `@Get()`, `@Post()`, `@Patch()`, `@Delete()`: HTTP 方法
- `@Body()`: 取得請求 body
- `@Param(key)`: 取得路由參數
- `@Query(key)`: 取得查詢字串參數
- `@Headers(key)`: 取得 HTTP headers
- `@Req()`, `@Res()`: 原始的 request/response 物件

---

### 3. 服務 (Services/Providers)

包含商業邏輯的類別。

```typescript
// transactions.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable() // 標記為可注入
export class TransactionsService {
  // 依賴注入
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, query: PaginationDto) {
    const { limit = 10, offset = 0, type } = query;

    return this.prisma.transaction.findMany({
      where: {
        userId,
        ...(type && { type }), // 條件性篩選
      },
      take: limit,
      skip: offset,
      orderBy: { date: 'desc' },
      include: { category: true }, // 包含關聯資料
    });
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: { category: true },
    });

    // 驗證資料存在
    if (!transaction) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }

    // 驗證擁有權
    if (transaction.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return transaction;
  }

  async create(dto: CreateTransactionDto, userId: string) {
    return this.prisma.transaction.create({
      data: {
        ...dto,
        userId,
      },
      include: { category: true },
    });
  }

  async update(id: string, dto: UpdateTransactionDto, userId: string) {
    // 先驗證存在和擁有權
    await this.findOne(id, userId);

    return this.prisma.transaction.update({
      where: { id },
      data: dto,
      include: { category: true },
    });
  }

  async remove(id: string, userId: string) {
    // 先驗證存在和擁有權
    await this.findOne(id, userId);

    return this.prisma.transaction.delete({
      where: { id },
    });
  }

  // 統計方法
  async getStats(userId: string, startDate: Date, endDate: Date) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalIncome = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      totalIncome,
      totalExpense,
      netIncome: totalIncome - totalExpense,
      transactionCount: transactions.length,
    };
  }
}
```

---

### 4. DTO (Data Transfer Objects)

用於定義請求和響應的資料結構，並自動驗證。

```typescript
// dto/create-transaction.dto.ts
import { IsNumber, IsString, IsEnum, IsOptional, IsDateString, Min, Max } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @IsEnum(['INCOME', 'EXPENSE'])
  type: 'INCOME' | 'EXPENSE';

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  categoryId?: string;
}

// dto/update-transaction.dto.ts
import { PartialType } from '@nestjs/mapped-types';

// 自動將所有欄位變為 optional
export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}

// dto/pagination.dto.ts
export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @IsEnum(['INCOME', 'EXPENSE'])
  type?: 'INCOME' | 'EXPENSE';
}
```

**常用驗證裝飾器**:

- `@IsString()`, `@IsNumber()`, `@IsBoolean()`
- `@IsEmail()`, `@IsUrl()`, `@IsUUID()`
- `@IsEnum(enum)`: 枚舉值
- `@IsOptional()`: 選填欄位
- `@Min(value)`, `@Max(value)`: 數字範圍
- `@MinLength(len)`, `@MaxLength(len)`: 字串長度
- `@IsDateString()`: ISO 日期字串

**啟用全域驗證**:

```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // 移除未在 DTO 定義的欄位
    forbidNonWhitelisted: true, // 有多餘欄位時拋錯
    transform: true, // 自動轉換型別
  })
);
```

---

### 5. Guards (守衛)

用於保護路由，實現認證和授權。

```typescript
// guards/supabase-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 提取 token
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // 驗證 token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SUPABASE_JWT_SECRET,
      });

      // 將 user 資訊附加到 request
      request.user = {
        id: payload.sub,
        email: payload.email,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractToken(request: any): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
```

**使用 Guard**:

```typescript
// 單一方法
@Get()
@UseGuards(SupabaseAuthGuard)
async findAll() { }

// 整個 Controller
@Controller('transactions')
@UseGuards(SupabaseAuthGuard)
export class TransactionsController { }

// 全域 (main.ts)
app.useGlobalGuards(new SupabaseAuthGuard(jwtService));
```

---

### 6. 自訂裝飾器

提取常用邏輯，讓程式碼更簡潔。

```typescript
// decorators/user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: keyof UserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // 如果指定欄位，只回傳該欄位
    return data ? user?.[data] : user;
  }
);

// decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

**使用自訂裝飾器**:

```typescript
@Get()
@UseGuards(SupabaseAuthGuard)
async findAll(@User() user: UserPayload) {
  // user 自動從 request.user 提取
}

@Get('profile')
async getProfile(@User('email') email: string) {
  // 只提取 email 欄位
}

@Get('public')
@Public()  // 標記為公開路由
async publicData() {
  // 不需要認證
}
```

---

### 7. 異常處理

NestJS 內建多種 HTTP 異常。

```typescript
import {
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException
} from '@nestjs/common';

// 使用範例
async findOne(id: string) {
  const item = await this.prisma.item.findUnique({ where: { id } });

  if (!item) {
    throw new NotFoundException(`Item ${id} not found`);
  }

  return item;
}

async create(dto: CreateDto) {
  try {
    return await this.prisma.item.create({ data: dto });
  } catch (error) {
    if (error.code === 'P2002') {  // Prisma unique constraint
      throw new ConflictException('Item already exists');
    }
    throw new InternalServerErrorException('Failed to create item');
  }
}
```

**自訂異常過濾器**:

```typescript
// filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}

// 使用 (main.ts)
app.useGlobalFilters(new HttpExceptionFilter());
```

---

### 8. 中介層 (Middleware)

處理請求前的邏輯。

```typescript
// middleware/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  }
}

// 註冊 middleware
@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // 所有路由
  }
}
```

---

### 9. 攔截器 (Interceptors)

轉換回應或加入額外邏輯。

```typescript
// interceptors/transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}

// 使用
@UseInterceptors(TransformInterceptor)
@Get()
async findAll() {
  return { items: [] };
}

// 回應會變成:
// {
//   "success": true,
//   "data": { "items": [] },
//   "timestamp": "2025-01-..."
// }
```

---

## Supabase JWT 驗證完整範例

### 1. 安裝依賴

```bash
npm install @nestjs/passport passport passport-jwt
npm install @nestjs/jwt
npm install @types/passport-jwt -D
```

### 2. 設定 JWT Strategy

```typescript
// auth/strategies/supabase-jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class SupabaseJwtStrategy extends PassportStrategy(Strategy, 'supabase-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SUPABASE_JWT_SECRET,
    });
  }

  async validate(payload: any) {
    if (!payload.sub) {
      throw new UnauthorizedException();
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
```

### 3. 建立 Auth Module

```typescript
// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SupabaseJwtStrategy } from './strategies/supabase-jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}), // 不需要設定，因為我們只驗證不簽發
  ],
  providers: [SupabaseJwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
```

### 4. 建立 Auth Guard

```typescript
// auth/guards/supabase-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SupabaseAuthGuard extends AuthGuard('supabase-jwt') {}
```

### 5. 使用

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [AuthModule, TransactionsModule],
})
export class AppModule {}

// transactions.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { User } from '../auth/decorators/user.decorator';

@Controller('transactions')
export class TransactionsController {
  @Get()
  @UseGuards(SupabaseAuthGuard) // 就這麼簡單！
  async findAll(@User() user) {
    console.log(user); // { id: '...', email: '...', role: '...' }
    return [];
  }
}
```

---

## 常用指令

```bash
# 建立專案
nest new project-name

# 生成資源
nest g module transactions
nest g controller transactions
nest g service transactions

# 生成完整 CRUD
nest g resource transactions

# 啟動開發伺服器
npm run start:dev

# 建置
npm run build

# 執行測試
npm run test
```

---

## 專案結構範例

```
src/
├── auth/
│   ├── decorators/
│   │   ├── public.decorator.ts
│   │   └── user.decorator.ts
│   ├── guards/
│   │   └── supabase-auth.guard.ts
│   ├── strategies/
│   │   └── supabase-jwt.strategy.ts
│   └── auth.module.ts
├── transactions/
│   ├── dto/
│   │   ├── create-transaction.dto.ts
│   │   ├── update-transaction.dto.ts
│   │   └── pagination.dto.ts
│   ├── transactions.controller.ts
│   ├── transactions.service.ts
│   └── transactions.module.ts
├── categories/
│   └── ...
├── prisma/
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── common/
│   ├── filters/
│   ├── interceptors/
│   └── pipes/
├── app.module.ts
└── main.ts
```

---

## 小技巧和最佳實踐

### 1. 環境變數管理

```typescript
// 安裝
npm install @nestjs/config

// app.module.ts
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // 讓所有模組都能用
      envFilePath: '.env',
    }),
  ],
})
export class AppModule {}

// 使用
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MyService {
  constructor(private configService: ConfigService) {}

  getDbUrl() {
    return this.configService.get<string>('DATABASE_URL');
  }
}
```

### 2. CORS 設定

```typescript
// main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
});
```

### 3. 全域前綴

```typescript
// main.ts
app.setGlobalPrefix('api'); // 所有路由變成 /api/xxx
```

### 4. Swagger API 文檔

```bash
npm install @nestjs/swagger swagger-ui-express
```

```typescript
// main.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Transaction API')
  .setDescription('API documentation')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);

// 訪問 http://localhost:3001/api/docs
```

---

這份快速參考指南涵蓋了 NestJS 開發中最常用的模式和概念，方便隨時查閱！
