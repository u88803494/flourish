# Flourish Documentation 📚

Welcome to the Flourish project documentation. This documentation follows a specification-driven development approach, organizing content by purpose and development phase.

---

## 🗺️ Documentation Structure

### 📋 Project Overview

- [Project Overview](./project-overview.md) - Vision, goals, and project philosophy

### 📝 Requirements

Detailed requirements documentation including user workflows, functional specifications, and requirements evolution:

- [Requirements Overview](./requirements/README.md) - Requirements documentation index
- [Vision and Workflow](./requirements/vision-and-workflow.md) - User workflows and detailed requirements
- [Workflow Pivot Analysis](./requirements/workflow-pivot-analysis.md) - Requirements evolution and architecture decisions
- [Functional Requirements](./requirements/functional-requirements.md) - Feature specifications with priorities

### 📖 Guides

Development guides and workflows:

- [Development Setup](./guides/development-setup.md) - How to set up and develop the project
- [Database Setup](./guides/database-setup.md) - Supabase + Prisma database configuration
- [Git Workflow](./guides/git-workflow.md) - Git workflow and commit message guidelines
- [API Documentation Workflow](./guides/api-documentation-workflow.md) - Guide for auto-generating API docs and types
- [Versioning Strategy](./guides/versioning-strategy.md) - Version management and release strategy
- [Deployment Guide](./guides/deployment.md) - Deployment strategies and configurations

### 🏗️ Architecture

System design and architecture documentation:

- [Authentication Flow](./architecture/authentication-flow.md) - Authentication system design
- [Database Design](./architecture/database-design.md) - Database schema and data models
- [Curves Integration](./architecture/curves-integration.md) - Curves tool integration approach

### 📚 References

Technical references and quick guides:

- [Project Glossary](./references/glossary.md) - Definitions of key project-specific terms
- [Database Troubleshooting](./references/database-troubleshooting.md) - Common database errors and solutions
- [Prisma Guide](./references/prisma-guide.md) - Prisma usage and tips
- [NestJS Quick Reference](./references/nestjs-quick-ref.md) - NestJS patterns and best practices
- [Discussion Summary](./references/discussion-summary.md) - Complete project discussion history
- [Tech Comparison](./references/tech-comparison.md) - Technology selection analysis and comparison
- [Naming Decisions](./references/naming-decisions.md) - Naming conventions and rationale
- [Development Tooling](./references/dev-tooling.md) - Development tools and configurations

### 🎯 Sprints

Sprint specifications following the requirements → implementation → tasks pattern:

- [Sprint 0: Foundation](./sprints/sprint-0-foundation/) - Basic monorepo setup and tooling
- Sprint 1: Authentication *(Coming soon)*
- Sprint 2: Transactions *(Coming soon)*
- Sprint 3: Statistics *(Coming soon)*

---

## 📖 How to Use This Documentation

### For New Developers

1. Start with [Project Overview](./project-overview.md)
2. Read [Vision and Workflow](./requirements/vision-and-workflow.md) to understand user needs
3. Follow [Development Setup](./guides/development-setup.md)
4. Read [Git Workflow](./guides/git-workflow.md)
5. Check current [Sprint Progress](./sprints/)

### For Feature Development

1. Review [Functional Requirements](./requirements/functional-requirements.md) for feature specifications
2. Read the Sprint's `requirements.md` for user stories and acceptance criteria
3. Review `implementation.md` for design and technical approach
4. Follow `tasks.md` to track implementation progress

### For Understanding Project Evolution

1. Read [Workflow Pivot Analysis](./requirements/workflow-pivot-analysis.md) to understand key architectural decisions
2. Check [Requirements Change History](./requirements/README.md#需求變更歷史) for recent updates

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
