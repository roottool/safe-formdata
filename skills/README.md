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

## Maintenance Policy

When updating design rules:

1. **Edit AGENTS.md first** (source of truth)
2. **Update corresponding references** in `boundary-validator/references/`
   - `design-rules.md` — Design rules section
   - `security-rules.md` — Security rules section
   - `api-contract.md` — API contract section
3. **Increment skill version** in `boundary-validator/SKILL.md` frontmatter
4. **Commit both** AGENTS.md and `skills/` changes together

## Official Specification

The Skills in this directory comply with the [agentskills.dev](https://agentskills.dev) official specification.

Validation tool:

```bash
skills-ref validate ./boundary-validator
```

## License

The same license as the safe-formdata project applies. See `LICENSE.txt` in each skill.
