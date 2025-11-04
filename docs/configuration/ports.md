# Port Configuration

## Current Port Assignments

All applications in the Flourish monorepo use the following port configuration:

| Application | Framework | Port | Status    |
| ----------- | --------- | ---- | --------- |
| Flow        | Next.js   | 3100 | ✅ Active |
| Apex        | Next.js   | 3200 | ✅ Active |
| API         | NestJS    | 6888 | ✅ Active |

## Running All Applications

To start all applications in development mode:

```bash
pnpm dev
```

This will start:

- Flow at http://localhost:3100 (Financial tracking)
- Apex at http://localhost:3200 (Statistics tracking)
- API at http://localhost:6888 (Backend API)

## Running Individual Applications

```bash
# Flow only
pnpm dev --filter=flow

# Apex only
pnpm dev --filter=apex

# API only
pnpm dev --filter=api
```

## Port Range Strategy

- **Frontend applications**: 3100-3199
  - Reserved for Next.js applications
  - Provides flexibility for future frontend apps

- **Backend services**: 6000-6999
  - Reserved for NestJS and other backend services
  - 6888 chosen for Flourish API for clarity and distinction

## Why Centralized Configuration is Not Used

This monorepo does **not** use centralized port configuration. Here's why:

1. **Technical Limitations**: Next.js's HTTP server initialization happens before the application code can read environment variables, making runtime port configuration impractical.

2. **Framework Differences**: Next.js and NestJS have different mechanisms for port configuration:
   - Next.js: Via `--port` CLI flag
   - NestJS: Via ConfigService or environment variables

3. **Industry Standard**: Most monorepos (Turborepo, Nx, Lerna-based) do not centralize port configuration. Port values are typically managed in each app's build scripts.

4. **Low Change Frequency**: Ports are stable configuration values that rarely change, making the complexity of centralization outweigh its benefits.

## Port Conflict Resolution

If a port is already in use:

```bash
# Find process using port (e.g., 3100)
lsof -i :3100

# Kill the process
kill -9 <PID>

# Or use pkill
pkill -f "next dev"

# Then restart
pnpm dev
```

## Configuration Location

Port values are defined in each application's `package.json`:

- **Flow**: `apps/flow/package.json` - `"dev": "next dev --turbopack --port 3100"`
- **Apex**: `apps/apex/package.json` - `"dev": "next dev -p 3200"`
- **API**: `apps/api/package.json` - Configured via `ConfigModule` in `main.ts`

---

**Last Updated**: 2025-11-04
**Maintained By**: Development Team
