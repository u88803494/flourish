# Flourish Documentation 📚

Welcome to the Flourish project documentation. This documentation follows a specification-driven development approach, organizing content by purpose and development phase.

---

## 🗺️ Documentation Structure

### 📋 Project Overview
- [Project Overview](./project-overview.md) - Vision, goals, and project philosophy

### 📖 Guides
Development guides and workflows:
- [Git Workflow](./guides/git-workflow.md) - Git workflow and commit message guidelines
- [Development Setup](./guides/development-setup.md) - How to set up and develop the project
- [Deployment Guide](./guides/deployment.md) - Deployment strategies and configurations

### 🏗️ Architecture
System design and architecture documentation:
- [Authentication Flow](./architecture/authentication-flow.md) - Authentication system design
- [Database Design](./architecture/database-design.md) - Database schema and data models
- [Curves Integration](./architecture/curves-integration.md) - Curves tool integration approach

### 📚 References
Technical references and quick guides:
- [Discussion Summary](./references/discussion-summary.md) - Complete project discussion history
- [Tech Comparison](./references/tech-comparison.md) - Technology selection analysis and comparison
- [Naming Decisions](./references/naming-decisions.md) - Naming conventions and rationale
- [NestJS Quick Reference](./references/nestjs-quick-ref.md) - NestJS patterns and best practices
- [Prisma Guide](./references/prisma-guide.md) - Prisma usage and tips
- [Development Tooling](./references/dev-tooling.md) - Development tools and configurations

### 🎯 Sprints
Sprint specifications following the requirements → implementation → tasks pattern:
- [Sprint 0: Foundation](./sprints/sprint-0-foundation/) - Basic monorepo setup and tooling
- Sprint 1: Authentication _(Coming soon)_
- Sprint 2: Transactions _(Coming soon)_
- Sprint 3: Statistics _(Coming soon)_

---

## 📖 How to Use This Documentation

### For New Developers
1. Start with [Project Overview](./project-overview.md)
2. Follow [Development Setup](./guides/development-setup.md)
3. Read [Git Workflow](./guides/git-workflow.md)
4. Check current [Sprint Progress](./sprints/)

### For Feature Development
1. Read the Sprint's `requirements.md` for user stories and acceptance criteria
2. Review `implementation.md` for design and technical approach
3. Follow `tasks.md` to track implementation progress

### For Technical Reference
Browse the [References](./references/) section for quick guides on specific technologies.

---

## 🎓 Documentation Philosophy

This project follows **specification-driven development**:
- Every feature starts with clear requirements (User Stories)
- Design decisions are documented before implementation
- Tasks are tracked with checkboxes for visibility
- All discussions and decisions are recorded

Inspired by agile methodologies and modern documentation best practices.

---

## 📝 Contributing to Documentation

When updating documentation:
- Keep it clear and concise
- Use examples where helpful
- Update the sprint's `tasks.md` when completing work
- Follow the [Git Workflow](./guides/git-workflow.md) for commits

---

## 🔗 Quick Links

- [Main README](../README.md) - Project README
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
