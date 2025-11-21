# AGENTS.md

**Purpose**: AI Agent collaboration guide for efficient and consistent development with Claude Code

**Last Updated**: 2025-11-21
**Status**: Active

---

## 🤖 Agent Roles & Responsibilities

### Primary Agent: Claude Code

**Role**: Full-stack development assistant with Supabase-first architecture expertise

**Key Responsibilities**:

- Code generation and refactoring
- Documentation creation and maintenance
- Sprint planning and execution
- Git workflow management
- Database migrations (Supabase SQL)
- Architecture decision support

**Context Sources**:

1. `CLAUDE.md` - Project development guide (primary reference)
2. `ARCHITECTURE.md` - System architecture and design patterns
3. `docs/references/glossary.md` - Project terminology
4. Sprint documentation in `docs/sprints/`
5. ADR files in `docs/decisions/`

---

## 🛠️ MCP Server Integration

### Available MCP Servers

**Supabase MCP** (Primary)

- Database operations and migrations
- Schema inspection and validation
- RLS policy management
- Function and trigger creation

**Context7 MCP**

- Library documentation lookup (React, Next.js, TypeScript)
- Framework best practices
- Official API reference

**Sequential Thinking MCP**

- Complex problem decomposition
- Multi-step reasoning and planning
- Architecture analysis

**Tavily MCP** (Research)

- Web search for current information
- Documentation discovery
- Technical research

### Tool Usage Guidelines

**When to use Supabase MCP**:

- Creating or modifying database migrations
- Checking schema consistency
- Testing RLS policies
- Inspecting database logs

**When to use Context7**:

- Implementing new framework features
- Checking official API documentation
- Finding best practices for libraries

**When to use Sequential**:

- Sprint planning and breakdown
- Complex architecture decisions
- Multi-file refactoring strategies

**When to use Tavily**:

- Finding latest package versions
- Researching new technologies
- Discovering community solutions

---

## 📋 Development Workflow

### 1. Sprint Planning Phase

**Agent Actions**:

1. Read Sprint requirements from `docs/sprints/sprint-X-*/overview.md`
2. Review related ADRs for architectural constraints
3. Use Sequential MCP to decompose tasks
4. Create detailed implementation plan
5. Get user approval before proceeding

**Output**:

- Detailed task breakdown
- File change manifest (CREATE, UPDATE, DELETE)
- Commit strategy
- Verification checklist

**Example**:

```
Sprint 0.9.3: Supabase Client Package
├── Task 1: Create @repo/supabase-client package
│   ├── CREATE packages/supabase-client/package.json
│   ├── CREATE packages/supabase-client/src/index.ts
│   └── UPDATE pnpm-workspace.yaml
├── Task 2: Generate TypeScript types
│   └── CREATE packages/supabase-client/src/types.ts
└── Task 3: Implement React hooks
    ├── CREATE packages/supabase-client/src/hooks/useAuth.ts
    └── CREATE packages/supabase-client/src/hooks/useTransactions.ts
```

### 2. Implementation Phase

**Agent Actions**:

1. Create feature branch: `feat/sprint-X-description`
2. Implement changes incrementally
3. Run verification after each significant change:
   - `pnpm build --filter=flow --filter=apex`
   - `pnpm lint`
   - `pnpm check-types`
4. Commit with Conventional Commits format
5. Push and create PR with comprehensive description

**Branch Naming Convention**:

```
feat/sprint-X-description       # Feature implementation
fix/issue-description           # Bug fixes
docs/documentation-update       # Documentation only
refactor/code-improvement       # Code restructuring
```

**Commit Message Format**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Example**:

```bash
git commit -m "feat(supabase-client): add authentication hooks

- Implement useAuth hook for session management
- Add useUser hook for current user data
- Include TypeScript types for auth state

Closes #20"
```

### 3. Verification Phase

**Required Checks**:

- [ ] Build passes: `pnpm build --filter=flow --filter=apex`
- [ ] Lint passes: `pnpm lint`
- [ ] Types valid: `pnpm check-types`
- [ ] Documentation updated (if applicable)
- [ ] Commits follow Conventional Commits

**Known Issues to Skip**:

- `docs` app build failures (pre-existing, unrelated)

### 4. Pull Request Phase

**PR Description Template**:

```markdown
## Sprint X: [Title]

**Issue**: Closes #XX
**Sprint Doc**: `docs/sprints/sprint-X-*/overview.md`

---

## Changes

### Created

- [ ] File/directory path
- [ ] File/directory path

### Modified

- [ ] File/directory path
- [ ] File/directory path

### Deleted

- [ ] File/directory path

---

## Verification

- [x] Build passes
- [x] Lint passes
- [x] Types valid
- [x] Documentation updated

---

## Implementation Notes

[Any important details, decisions, or context]
```

---

## 🎯 Best Practices

### Code Generation

**DO**:

- ✅ Follow existing code patterns in the file
- ✅ Use TypeScript strict mode
- ✅ Add JSDoc comments for public APIs
- ✅ Include error handling
- ✅ Use descriptive variable names

**DON'T**:

- ❌ Generate code without understanding context
- ❌ Skip type annotations
- ❌ Ignore existing patterns
- ❌ Create unnecessary abstractions
- ❌ Hard-code environment variables

### Documentation

**DO**:

- ✅ Update CLAUDE.md when architecture changes
- ✅ Create ADR for significant decisions
- ✅ Document breaking changes
- ✅ Update Sprint overview when completing tasks
- ✅ Use glossary terms consistently

**DON'T**:

- ❌ Generate documentation without code changes
- ❌ Update docs without implementation
- ❌ Leave TODOs in documentation
- ❌ Use inconsistent terminology
- ❌ Forget to update "Last Updated" dates

### Database Migrations

**DO**:

- ✅ Use Supabase CLI for migrations: `npx supabase migration new [name]`
- ✅ Follow migration guide: `docs/guides/database-migrations.md`
- ✅ Test migrations locally: `npx supabase db reset`
- ✅ Include RLS policies for new tables
- ✅ Add indexes for foreign keys

**DON'T**:

- ❌ Use Prisma migrations (deprecated)
- ❌ Skip RLS policies
- ❌ Hard-code UUIDs
- ❌ Push untested migrations to production
- ❌ Forget to document breaking changes

---

## 🔍 Context Management

### Reading Priority

**When starting a new task**:

1. Read CLAUDE.md (always first)
2. Read ARCHITECTURE.md (if architecture-related)
3. Read Sprint overview (`docs/sprints/sprint-X-*/overview.md`)
4. Read ADRs if referenced
5. Read glossary for unfamiliar terms

**When implementing features**:

1. Read existing similar code in codebase
2. Use Context7 for framework-specific patterns
3. Check git history for recent changes: `git log --oneline -- <file>`

**When stuck**:

1. Use Sequential MCP to break down the problem
2. Search web with Tavily for solutions
3. Review Sprint documentation for context
4. Ask user for clarification

### Memory Management

**Agent should remember**:

- Current Sprint number and goals
- Recent architectural decisions (ADRs)
- Active branch name
- Outstanding tasks in current Sprint

**Agent can forget**:

- Completed Sprint details (documented in overview)
- Deprecated features (documented in archive)
- Temporary implementation details

---

## 🚨 Error Handling

### Common Issues

**Build Failures**:

```bash
# Problem: Type errors
# Solution:
pnpm check-types
# Fix reported type errors

# Problem: Lint errors
# Solution:
pnpm lint --fix
```

**Migration Failures**:

```bash
# Problem: Migration already exists
# Solution: Use IF NOT EXISTS
CREATE TABLE IF NOT EXISTS table_name (...)

# Problem: RLS blocks access
# Solution: Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'table_name'
```

**Git Issues**:

```bash
# Problem: Merge conflicts
# Solution:
git status
git diff <conflicted-file>
# Resolve conflicts, then:
git add <resolved-file>
git commit

# Problem: Wrong branch
# Solution:
git checkout main
git pull
git checkout -b feat/correct-branch
```

### Escalation Protocol

**When to ask user**:

1. Architectural decisions not covered by ADRs
2. Breaking changes that affect existing functionality
3. Ambiguous requirements in Sprint documentation
4. Resource constraints (e.g., package size concerns)
5. Security considerations (e.g., exposing sensitive data)

**How to ask**:

- Provide context from documentation
- Explain the trade-offs
- Suggest 2-3 options with pros/cons
- Recommend preferred option with reasoning

---

## 📊 Quality Standards

### Code Quality

**Metrics**:

- TypeScript strict mode compliance: 100%
- Lint errors: 0
- Build success: Required
- Test coverage: Not yet required (future)

**Review Checklist**:

- [ ] Follows project code style
- [ ] No console.log statements (use proper logging)
- [ ] Error handling implemented
- [ ] Types are specific (not `any`)
- [ ] Functions are focused and testable

### Documentation Quality

**Metrics**:

- Up-to-date: Last Updated within 7 days of change
- Complete: All sections filled
- Accurate: Matches actual implementation
- Consistent: Uses glossary terms

**Review Checklist**:

- [ ] Follows Diataxis framework (when applicable)
- [ ] Examples are tested
- [ ] Links are valid
- [ ] Code blocks have language tags
- [ ] Uses proper heading hierarchy

---

## 🎓 Learning & Adaptation

### Agent Improvement Areas

**Technical Skills**:

- Supabase advanced features (Edge Functions, Realtime)
- Next.js 15 App Router patterns
- React Server Components
- Performance optimization

**Process Skills**:

- Sprint planning accuracy
- Time estimation
- Breaking down complex tasks
- Git workflow efficiency

### Feedback Loop

**After each Sprint**:

1. Review what went well
2. Identify what could be improved
3. Update this document with learnings
4. Incorporate feedback into next Sprint

**User Feedback Integration**:

- User corrections → Update understanding
- User preferences → Document in CLAUDE.md
- User patterns → Recognize and follow
- User concerns → Address proactively

---

## 🔗 Related Documentation

**Core Documents**:

- `CLAUDE.md` - Primary development guide
- `ARCHITECTURE.md` - System architecture
- `docs/references/glossary.md` - Project terminology

**Workflow Documents**:

- `docs/deployment/git-workflow.md` - Git and deployment process
- `docs/guides/database-migrations.md` - Migration workflow

**Planning Documents**:

- `docs/sprints/sprint-0-foundation/overview.md` - Current phase status
- `docs/decisions/` - Architecture Decision Records

---

**Maintained By**: Claude Code Agent
**Review Frequency**: Every Sprint
**Next Review**: Sprint 11 (2025-11-22)
