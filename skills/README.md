# safe-formdata Agent Skills

This directory contains **Agent Skills** specific to the safe-formdata project.

## What are Agent Skills?

Agent Skills are structured knowledge packages that agents like Claude Code can efficiently reference. Based on the implementation rules in AGENTS.md, they provide:

- **Automatic triggering**: Activates automatically during PR creation and code review
- **Progressive disclosure**: Loads only necessary information incrementally
- **Standardized format**: Complies with the [agentskills.dev](https://agentskills.dev) official specification

## Available Skills

### boundary-validator

Performs code review based on boundary principles.

- **Purpose**: Automatically detect violations of safe-formdata's design principles
- **Triggers**: PR creation, code review, post-implementation
- **Validation items**:
  - Key opacity (no array notation parsing, etc.)
  - No silent behavior (no merging, overwriting, etc.)
  - No inference or convenience features
  - Explicit error reporting

For details, see [`boundary-validator/SKILL.md`](./boundary-validator/SKILL.md).

## Supported Tools

### ✅ Automatic Support

- **Claude Code** - Automatically detects `skills/` in the project

### ⚠️ Manual Reference Required

- **Windsurf** - Instruct to reference AGENTS.md directly
- **Cursor** - Specify rules in AGENTS.md or `.cursorrules`
- **claude.ai Web** - Manually upload as project knowledge

## Relationship to AGENTS.md

- **AGENTS.md**: Master document for both humans and agents
- **skills/**: Optimized version for Agent Skills-compatible tools

If you're using tools that don't support Agent Skills, please reference [AGENTS.md](../AGENTS.md) directly.

## Maintenance Policy

1. **AGENTS.md is the source of truth**: Make design principle changes in AGENTS.md first
2. **Skills follow**: Reflect AGENTS.md changes in `skills/`
3. **Strategic duplication**: Document duplication is acceptable due to different purposes

## Official Specification

The Skills in this directory comply with the [agentskills.dev](https://agentskills.dev) official specification.

Validation tool:

```bash
skills-ref validate ./boundary-validator
```

## License

The same license as the safe-formdata project applies. See `LICENSE.txt` in each skill.
